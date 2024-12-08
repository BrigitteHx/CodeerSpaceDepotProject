const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 5000;
const secretKey = process.env.JWT_SECRET || '77b22a07938ccbb0565abc929d9ee5726affa3c4b197ea58ed28374d8f42161cadf47f74a95a10099d9c9d72541fbea1f579ba123b68cb9021edf8046ce030c6'; // Use environment variable for the secret key

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'depotproject_backend'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});
// Rate limiting setup
const requestCounts = {};
const rateLimitWindow = 86400000; // 24 hours in milliseconds
const requestLimit = 5;

const rateLimiter = (req, res, next) => {
    const email = req.body.email;
    if (!email) return next();

    const currentTime = Date.now();
    
    // Initialize request tracking for this email if it doesn't exist
    if (!requestCounts[email]) {
        requestCounts[email] = { count: 1, firstRequestTime: currentTime };
    } else {
        // Check if the current time is within the rate limit window
        if (currentTime - requestCounts[email].firstRequestTime < rateLimitWindow) {
            requestCounts[email].count += 1;
            console.log(`Request from ${email}: Count = ${requestCounts[email].count}`);
            
            // If the limit is exceeded, send a 429 response
            if (requestCounts[email].count > requestLimit) {
                return res.status(429).json({ message: 'Too many requests. Please try again later.' });
            }
        } else {
            // Reset the count after the window has expired
            requestCounts[email] = { count: 1, firstRequestTime: currentTime };
        }
    }
    next();
};
// JWT verification middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('No token provided.');
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], secretKey); 
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).send('Unauthorized: Invalid token');
    }
};

// Register endpoint
app.post('/api/register', (req, res) => {
    // Haal alle waarden uit de request body, inclusief enableMFA
    const { email, name, password, phoneNumber, location, enableMFA } = req.body;

    // Controleer of enableMFA goed is gedefinieerd
    console.log('MFA inschakelen:', enableMFA);

    const hashedPassword = bcrypt.hashSync(password, 8);

    // Voeg de gebruiker toe aan de database, inclusief de mfa_enabled kolom
    db.query('INSERT INTO users (email, name, password, phoneNumber, location, mfa_enabled) VALUES (?, ?, ?, ?, ?, ?)',
        [email, name, hashedPassword, phoneNumber, location, enableMFA], (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).send('Error registering user');
            }
            res.status(200).send('User registered successfully');
        });
});


// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Zoek de gebruiker op basis van het e-mailadres
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('User not found');
        }

        const user = results[0];

        // Vergelijk het wachtwoord met het gehashte wachtwoord in de database
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send('Invalid password');
        }

        // Genereer een JWT-token
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: 86400 }); // 24 uur

        // Verstuur de response met de token en mfa_enabled status
        res.status(200).send({
            auth: true,
            token: token,
            mfaEnabled: user.mfa_enabled // Voeg deze toe om aan te geven of MFA is ingeschakeld
        });
    });
});

// Attach db to all routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Use external user routes (e.g., /user-info)
app.use('/api', userRoutes);
// Password reset request endpoint with rate limiting
app.post('/api/password-reset', rateLimiter, (req, res) => {
    const { email } = req.body;
    const { token, newPassword } = req.body;
    // Validate that the email is provided
    if (!email) {
        return res.status(400).send('Email is required');
    }

    // Find the user in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database query error (SELECT):', err);
            return res.status(500).send('Server error while querying the database');
        }

        // Check if email exists
        if (results.length === 0) {
            return res.status(404).json({ message: 'Email not registered' });
        }

        const user = results[0];
        const currentTime = new Date();
        const lastPasswordReset = user.lastPasswordReset ? new Date(user.lastPasswordReset) : null;

        // Check if lastPasswordReset exists and if it's within the rate limit window
        const requestsToday = lastPasswordReset && (currentTime - lastPasswordReset < rateLimitWindow) 
            ? 1 : 0;

        // If the user has requested more than the limit, deny the request
        if (requestsToday >= requestLimit) {
            return res.status(429).json({ message: 'You have reached the maximum number of password reset requests. Please try again later.' });
        }

        // Generate the reset token and expiration
        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiration = new Date(Date.now() + 3600000); // 1 hour expiration

        // Update the database with the token, expiration, and last password reset time
        db.query('UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ?, lastPasswordReset = ? WHERE email = ?', 
            [token, tokenExpiration, currentTime, email], (err) => {
                if (err) {
                    console.error('Error saving token (UPDATE):', err);
                    return res.status(500).send('Error saving token in the database');
                }

                // Nodemailer setup
                const transporter = nodemailer.createTransport({
                    service: 'Gmail', 
                    auth: {
                        user: 'solarpanelsimulation@gmail.com',
                        pass: 'zgyi dlqa zmgn gkdd', // Use environment variable or secret manager for real apps
                    },
                });
                
                const mailOptions = {
                    to: user.email,
                    from: 'passwordreset@solarpanelsimulation.com',
                    subject: 'Password Reset Request',
                    text: `Hello ${user.name},\n\n` + 
                          `You are receiving this email because we received a request to reset the password for your account.\n\n` +
                          `To reset your password, please click on the following link or paste it into your browser:\n\n` +
                          `http://localhost:5000/reset/${token}\n\n` +
                          `This link will expire in one hour. If you did not request this, please ignore this email and your password will remain unchanged.\n\n` +
                          `Best regards,\n` +
                          `The Solar Panel Simulation Team\n` +
                          `For questions or support, please contact us at solarpanelsimulation@gmail.com\n`,
                    html: `<h2>Password Reset Request</h2>
                           <p>Hello ${user.name},</p>
                           <p>You are receiving this email because we received a request to reset the password for your account.</p>
                           <p>To reset your password, please click on the following link or paste it into your browser:</p>
                           <p><a href="http://localhost:5000/reset/${token}">Reset Password</a></p>
                           <p>This link will expire in one hour. If you did not request this, please ignore this email and your password will remain unchanged.</p>
                           <p>Best regards,<br/>The Solar Panel Simulation Team</p>
                           <p>For questions or support, please contact us at <a href="mailto:solarpanelsimulation@gmail.com">solarpanelsimulation@gmail.com</a></p>`,
                };

                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        console.error('Error sending email:', err);
                        return res.status(500).send('Error sending email');
                    }
                    res.status(200).send('Password reset email sent');
                });
            });
    });
});


// Reset password verification endpoint
app.get('/reset/:token', (req, res) => {
    const token = req.params.token;
    // Find the user by token\
    console.log("test rese")
    db.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', 
    [token, Date.now()], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }
        console.log("test rese2")
        res.status(200).send('Token is valid');
    });
});

// Reset password endpoint
app.post('/api/reset-password', (req, res) => {
    console.log('Received request for password reset');  
    const { token, newPassword } = req.body;
    console.log("test " + token)
    // Find the user based on the token
    db.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', 
    [token, Date.now()], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send({ message: 'Password reset token is invalid or has expired.' });
        }

        const user = results[0];
        const hashedPassword = bcrypt.hashSync(newPassword, 8);

        // Update the password in the database and clear the token
        db.query('UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE email = ?', 
        [hashedPassword, user.email], (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error updating password' });
            }
            res.status(200).send({ message: 'Password has been updated successfully' });
        });
    });
});


// Middleware for authentication (example)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
  
    const token = authHeader.split(' ')[1];
    // Add your token verification logic here
    if (!token) return res.status(403).json({ message: 'Forbidden' });
  
    // If verified
    next();
};

// Endpoint to add a battery
app.post('/api/addBattery', verifyToken, (req, res) => {
    console.log('Request body:', req.body);
    const { name, capacity, installationDate } = req.body;

    // Validate required fields
    if (!name || !capacity || !installationDate) {
        console.error('Missing required fields');
        return res.status(400).json({ error: 'All fields are required' });
    }

    const userId = req.userId;  // Now using the userId from the JWT token
    console.log('User ID:', userId);

    if (!userId) {
        console.error('Missing user ID');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const sql = 'INSERT INTO Battery (name, capacity, installation_date, user_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, capacity, installationDate, userId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Battery added:', result);
        res.status(201).json({ message: 'Battery added successfully' });
    });
});

// Contact form route
app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;

    // Check if required fields are present
    if (!name || !email || !message) {
        console.log("Validation error: Missing required fields");
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Set up Nodemailer transporter with Gmail
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'contactpaginatest@gmail.com',
            pass: 'mhkm nhvz pmit lyud' 
        }
    });

    // Email setup for sending to the company
    const companyMailOptions = {
        from: email,
        to: 'contactpaginatest@gmail.com',
        subject: `New Contact Request from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`
    };

    console.log("Attempting to send email to company...");

    // Attempt to send the company email
    transporter.sendMail(companyMailOptions, (error, info) => {
        if (error) {
            console.error('Error during company email send:', error.message);  // Log specific error message
            console.error('Error stack trace:', error.stack);  // Log stack trace for detailed error info
            return res.status(500).json({ message: 'Error sending the email to the company.' });
        }
        console.log('Email sent to company successfully:', info.response);

        // Email setup for confirmation to the user
        const userMailOptions = {
            from: 'no-reply@contactpaginatest.com',
            to: email,
            subject: 'Your Contact Request has been Received!',
            text: `Hello ${name},\n\nThank you for reaching out! We've received your message:\n\n"${message}"\n\nOur team will get back to you soon.\n\nBest regards,\nCompany Support`
        };

        console.log("Attempting to send confirmation email to user...");

        // Attempt to send confirmation email to the user
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Error during confirmation email send:', error.message);  // Log specific error message
                console.error('Error stack trace:', error.stack);  // Log stack trace for detailed error info
                return res.status(500).json({ message: 'Error sending confirmation email to user.' });
            }
            console.log('Confirmation email sent to user successfully:', info.response);
            res.status(200).json({ message: 'Message successfully sent!' });
        });
    });
});

app.get('/api/readBatteries',verifyToken, (req, res) => {
    const userId = req.userId; // Ensure that the userId is available in the session or JWT token
  
    if (!userId) {
      console.error('Missing user ID');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    // Correct SQL query with parameter binding
    const sql = 'SELECT * FROM battery WHERE user_id = ?';
    
    // Assuming you have a MySQL connection `db` to run the query
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching batteries:', err);
        return res.status(500).json({ error: 'Failed to fetch batteries' });
      }
      res.json(results); // Send the batteries data as response
    });
  });
// Endpoint to handle user action
app.post('/api/user-action', authenticateToken, (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    console.log(`Received user ID: ${userId}`);
    // Perform the desired action, e.g., save to database
    res.status(200).json({ message: 'User ID received successfully', userId });
});

// Get user profile data
app.get('/api/user-profile', verifyToken, (req, res) => {
    const userId = req.userId;

    // Query to get user details
    db.query('SELECT id, name, email, phoneNumber, location, bio, gender, dob, notifications FROM users WHERE id = ?', [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = results[0];
        res.status(200).json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phoneNumber: user.phoneNumber,
              location: user.location,
              bio: user.bio,
              gender: user.gender,
              dob: user.dob || '',
              notifications: user.notifications || []
            }
        });
      });
});


// Update user profile
app.put('/update-profile', verifyToken, (req, res) => {
    const userId = req.userId; // Assumed you get the userId from token verification middleware
    const { name, email, phoneNumber, location, bio, gender, dob, notifications } = req.body;

    // Update user profile in the database (including email)
    db.query(
        'UPDATE users SET name = ?, email = ?, phoneNumber = ?, location = ?, bio = ?, gender = ?, dob = ? WHERE id = ?',
        [name, email, phoneNumber, location, bio, gender, dob, userId],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to update profile' });
            }

            // Fetch the updated user details including the updated email and notification preferences
            db.query(
                'SELECT email, name, notifications FROM users WHERE id = ?',
                [userId],
                (err, results) => {
                    if (err || results.length === 0) {
                        return res.status(404).send('User not found');
                    }

                    const user = results[0];

                    // Check notification preference
                    if (!user.notifications) {
                        // If notifications are disabled, skip email and return success
                        return res.status(200).json({ message: 'Profile updated successfully, no notification sent' });
                    }

                    // Set up email transporter
                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                        },
                    });

                    const mailOptions = {
                        to: user.email, // Send to the updated email address
                        from: 'noreply@yourdomain.com',
                        subject: 'Profile Updated',
                        text: `Hello ${user.name},\n\nYour account profile has been successfully updated.\n\nIf you did not make this change, please contact our support team immediately.\n\nBest regards,\nThe Team`,
                        html: `<h2>Profile Updated</h2>
                               <p>Hello ${user.name},</p>
                               <p>Your account profile has been successfully updated.</p>
                               <p>If you did not make this change, please contact our support team immediately.</p>
                               <p>Best regards,<br/>The Team</p>`,
                    };

                    // Send confirmation email
                    transporter.sendMail(mailOptions, (err) => {
                        if (err) {
                            console.error('Error sending update email:', err);
                            return res.status(500).json({ error: 'Error sending email notification' });
                        }

                        // Return success response
                        res.status(200).json({ message: 'Profile updated and notification sent' });
                    });
                }
            );
        }
    );
});


// Endpoint to check if email exists
app.post('/check-email', verifyToken, (req, res) => {
    const { email } = req.body;
    const userId = req.userId; // Assuming the user ID is retrieved from the token
  
    // Query to check if the email already exists in the database
    db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to check email' });
        }
  
        // If email already exists for a different user
        if (results.length > 0) {
          return res.status(400).json({ exists: true });
        }
  
        // If email is unique, proceed
        return res.status(200).json({ exists: false });
      }
    );
  });

  
// Upload profile picture
// Set storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage });
  // Ensure the directory exists
  const fs = require('fs');
  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
  }
  
  app.put('/upload-profile-picture', verifyToken, upload.single('profilePicture'), (req, res) => {
    const userId = req.userId;
    const filePath = `/uploads/${req.file.filename}`; // Store the file path

    // Update the user's profile picture in the database
    db.query(
        'UPDATE users SET profilePicture = ? WHERE id = ?',
        [filePath, userId],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to update profile picture' });
            }

            // Fetch user details and notification preferences
            db.query(
                'SELECT email, name, notifications FROM users WHERE id = ?',
                [userId],
                (err, results) => {
                    if (err || results.length === 0) {
                        return res.status(404).send('User not found');
                    }

                    const user = results[0];

                    // Check notification preference
                    if (!user.notifications) {
                        // If notifications are disabled, skip email and return success
                        return res.status(200).json({ message: 'Profile picture updated successfully, no notification sent', filePath });
                    }

                    // Set up email transporter
                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                        },
                    });

                    const mailOptions = {
                        to: user.email,
                        from: 'noreply@yourdomain.com',
                        subject: 'Profile Picture Updated',
                        text: `Hello ${user.name},\n\nYour profile picture has been successfully updated.\n\nIf you did not make this change, please contact our support team immediately.\n\nBest regards,\nThe Team`,
                        html: `<h2>Profile Picture Updated</h2>
                               <p>Hello ${user.name},</p>
                               <p>Your profile picture has been successfully updated.</p>
                               <p>If you did not make this change, please contact our support team immediately.</p>
                               <p>Best regards,<br/>The Team</p>`,
                    };

                    // Send confirmation email
                    transporter.sendMail(mailOptions, (err) => {
                        if (err) {
                            console.error('Error sending profile picture update email:', err);
                            return res.status(500).json({ error: 'Error sending email notification' });
                        }

                        // Send successful response
                        res.status(200).json({ message: 'Profile picture updated successfully and notification sent', filePath });
                    });
                }
            );
        }
    );
});


// Notification email function
app.put('/update-notifications', verifyToken, (req, res) => {
    const userId = req.userId;
    const { notifications } = req.body;

    // Update notification preferences in the database
    db.query(
        'UPDATE users SET notifications = ? WHERE id = ?',
        [notifications, userId],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to update notification preference' });
            }

            // Prepare email notification if notifications are enabled
            if (notifications) {
                db.query(
                    'SELECT email, name FROM users WHERE id = ?',
                    [userId],
                    (err, results) => {
                        if (err || results.length === 0) {
                            return res.status(404).send('User not found');
                        }

                        const user = results[0];

                        // Set up email transporter
                        const transporter = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                user: process.env.EMAIL_USER,
                                pass: process.env.EMAIL_PASS,
                            },
                        });

                        const mailOptions = {
                            to: user.email,
                            from: 'noreply@yourdomain.com',
                            subject: 'Notification Preferences Updated',
                            text: `Hello ${user.name},\n\nYour notification preferences have been successfully updated.\n\nBest regards,\nThe Team`,
                            html: `<h2>Notification Preferences Updated</h2>
                                   <p>Hello ${user.name},</p>
                                   <p>Your notification preferences have been successfully updated.</p>
                                   <p>Best regards,<br/>The Team</p>`,
                        };

                        // Send confirmation email
                        transporter.sendMail(mailOptions, (err) => {
                            if (err) {
                                console.error('Error sending update email:', err);
                                return res.status(500).json({ error: 'Error sending email notification' });
                            }

                            // Send success response only after email is sent
                            res.status(200).json({ message: 'Notification preference updated successfully and email sent' });
                        });
                    }
                );
            } else {
                // If notifications are disabled, return success without email
                res.status(200).json({ message: 'Notification preference updated successfully, no email sent' });
            }
        }
    );
});


// Deleting user account API endpoint
app.delete('/api/delete-account', verifyToken, (req, res) => {
    const userId = req.userId;  // Extract user ID from the JWT token
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    // Step 1: Fetch user details for email notification
    db.query('SELECT email, name FROM users WHERE id = ?', [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error fetching user for email notification:', err);
            return res.status(500).json({ error: 'Error fetching user details for email' });
        }

        const user = results[0];

        // Step 2: Set up email transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: 'noreply@yourdomain.com',
            subject: 'Account Deletion Confirmation',
            text: `Hello ${user.name},\n\nYour account has been successfully deleted. We're sorry to see you go.\n\nIf this was a mistake, please contact our support team.\n\nBest regards,\nThe Team`,
            html: `<h2>Account Deletion Confirmation</h2>
                   <p>Hello ${user.name},</p>
                   <p>Your account has been successfully deleted. We're sorry to see you go.</p>
                   <p>If this was a mistake, please contact our support team.</p>
                   <p>Best regards,<br/>The Team</p>`,
        };

        // Step 3: Send confirmation email
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending account deletion email:', err);
                return res.status(500).json({ error: 'Error sending email notification' });
            }

            // Step 4: Delete the user account from the database
            db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
                if (err) {
                    console.error('Error deleting account:', err);
                    return res.status(500).json({ error: 'Error deleting account' });
                }

                // Step 5: Send a successful response to the client
                res.status(200).json({ message: 'Account deleted successfully. A confirmation email has been sent.' });
            });
        });
    });
});

// MFA code

app.post('/api/setup-mfa', verifyToken, (req, res) => {
    const { email } = req.body;

    // Genereer een tijdelijke secret
    const secret = crypto.randomBytes(20).toString('hex'); 

    // Update de database met de secret en activeer MFA
    req.db.query('UPDATE users SET mfa_secret = ?, mfa_enabled = 1 WHERE email = ?', [secret, email], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Fout bij het instellen van MFA.');
        }
        res.status(200).send('MFA succesvol ingeschakeld.');
    });
});

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Pas dit aan afhankelijk van je e-mailprovider
    auth: {
        user: 'contactpaginatest@gmail.com',
        pass: 'mhkm nhvz pmit lyud'  // Zet je wachtwoord in .env
    },
});

app.post('/api/send-mfa-code', (req, res) => {
    const { email } = req.body;

    // Genereer een 6-cijferige code en stel een vervaltijd in
    const mfaCode = crypto.randomInt(100000, 999999).toString();
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minuten geldig

    // Update de database met de gegenereerde code
    req.db.query('UPDATE users SET mfa_code = ?, mfa_expiry = ? WHERE email = ?', [mfaCode, expirationTime, email], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Fout bij het genereren van MFA-code.');
        }

        // Verstuur de e-mail
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Uw MFA-code',
            text: `Uw MFA-code is: ${mfaCode}`,
        }, (mailErr) => {
            if (mailErr) {
                console.error(mailErr);
                return res.status(500).send('Fout bij het verzenden van e-mail.');
            }
            res.status(200).send('MFA-code verzonden.');
        });
    });
});

app.post('/api/verify-mfa', (req, res) => {
    const { email, code } = req.body;

    // Haal de opgeslagen code en vervaltijd op uit de database
    req.db.query('SELECT mfa_code, mfa_expiry FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Gebruiker niet gevonden.');
        }

        const { mfa_code, mfa_expiry } = results[0];

        // Controleer of de code geldig is en niet verlopen
        if (mfa_code === code && Date.now() < mfa_expiry) {
            return res.status(200).send('MFA succesvol.');
        }
        res.status(401).send('MFA-code ongeldig of verlopen.');
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
