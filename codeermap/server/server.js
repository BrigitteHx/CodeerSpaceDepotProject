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
const router = express.Router();
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');
const moment = require('moment-timezone');
const axios = require('axios');
const otplib = require('otplib');

const app = express();
const PORT = process.env.PORT || 5000;
const secretKey = process.env.JWT_SECRET || '77b22a07938ccbb0565abc929d9ee5726affa3c4b197ea58ed28374d8f42161cadf47f74a95a10099d9c9d72541fbea1f579ba123b68cb9021edf8046ce030c6'; // Use environment variable for the secret key

const API_TOKEN_ENERGY = "322f26287a84ed49d269de8d238380f6";
const todayURL = `https://enever.nl/api/stroomprijs_vandaag.php?token=${API_TOKEN_ENERGY}`;
const monthURL = `https://enever.nl/api/stroomprijs_laatste30dagen.php?token=${API_TOKEN_ENERGY}`;

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
    const { email, name, password, phoneNumber, location } = req.body;

    // Validate required fields
    if (!email || !name || !password || !phoneNumber || !location) {
        return res.status(400).send('All fields are required');
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Add user to the database
    db.query('INSERT INTO users (email, name, password, phoneNumber, location) VALUES (?, ?, ?, ?, ?)', 
        [email, name, hashedPassword, phoneNumber, location], (err, result) => {
            if (err) {
                console.error('Error registering user:', err.code); // Log error code
                console.error('Error message:', err.message); // Log error message
                return res.status(500).send('Error registering user'); // Return error response
            }
            res.status(200).send('User registered successfully');
        }
    );
});
function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]); // Return the first result
        });
    });
}


// Endpoint to check if MFA is enabled for a user
app.get('/api/check-mfa-enabled', async (req, res) => {
    try {
        const email = req.query.email; // Retrieving the email from query parameters
        if (!email) {
            return res.status(400).json({ message: 'Email parameter is required' });
        }
        // Query the database or other logic to check if MFA is enabled for the user
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const mfaEnabled = user.mfaEnabled;
        res.status(200).json({ mfaEnabled });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while checking MFA status' });
    }
});

//check mfa status
app.post('/check-mfa-status', async (req, res) => {
    try {
        // Logic to check MFA status
        const user = await getUserFromSession(req.session.userId);
        if (!user) throw new Error('User not found');
        const mfaStatus = await checkMFAStatus(user);
        res.status(200).json({ mfaStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while checking MFA status' });
    }
})

// Login endpoint update to check MFA status
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
         // Generate and return token
         const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '24h' });
         
        // Check MFA status
        if (user.mfa_enabled && user.mfa_secret) {
            return res.json({
              requireMFA: true,
              mfaMethod: user.mfa_method,
              userId: user.id,
              auth: true,
              token // Send user ID for further verification
            });
          }
          res.status(200).json({ auth: true, token });
       
    });
});


// Route to generate TOTP secret and QR code
// Route to generate TOTP secret and QR code
app.post('/api/setup-totp', async (req, res) => {
    try {
      const userEmail = req.body.email;
      const appName = 'Solar Panel Simulatie'; // Your app's name
  
      // Generate TOTP secret
      const secret = otplib.authenticator.generateSecret(); // Generate the TOTP secret
      const otpauthUrl = otplib.authenticator.keyuri(userEmail, appName, secret); // Generate the otpauth URL for the QR code
  
      // Store the secret temporarily (pending state)
      pendingMfaSecrets[userEmail] = secret;
  
      // Generate QR Code image data URL
      QRCode.toDataURL(otpauthUrl, (err, data_url) => {
        if (err) {
          console.error('Error generating QR code:', err);
          return res.status(500).json({ message: 'Failed to generate QR code' });
        }
        // Send QR code URL and secret to the client
        res.status(200).json({
          qrCodeUrl: otpauthUrl,  // Send the QR code image URL
          secret: secret,       // Send the temporary secret
        });
      });
    } catch (error) {
      console.error('Error generating TOTP:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/MFA-Login',(req,res)=>{

    
})
app.post('/api/setup-mfa', (req, res) => {
    const { email } = req.body;
    // Genereer een tijdelijke secret
    const secret = crypto.randomBytes(20).toString('hex'); 
    // Update de database met de secret en activeer MFA
    db.query('UPDATE users SET mfa_secret = ?, mfa_enabled = 1 , mfa_method = "email" WHERE email = ?', [secret, email], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Fout bij het instellen van MFA.');
        }
        res.status(200).send('MFA succesvol ingeschakeld.');
    });
});

// Route to verify TOTP token using otplib
app.post('/api/verify-totp', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Retrieve the user's MFA secret from the temporary storage
    const secret = pendingMfaSecrets[email];

    if (!secret) {
      return res.status(400).json({ message: 'No pending MFA setup for this email' });
    }

    // Validate the OTP using otplib
    const isValid = otplib.authenticator.verify({ token: otp, secret });
    if (isValid) {
      // If OTP is valid, save the MFA settings in the database
      db.query('UPDATE users SET mfa_secret = ?, mfa_enabled = ?, mfa_method = ? WHERE email = ?', 
        [secret, true, 'totp', email], (err) => {
            if (err) {
                console.error('Error updating user MFA settings:', err);
                return res.status(500).json({ message: 'Failed to save MFA settings' });
            }

            // Remove the pending secret after saving it to the database
            delete pendingMfaSecrets[email];

            res.status(200).json({ message: 'MFA setup completed successfully' });
        }
      );
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
});

const getExternalTime = async () => {
    try {
      const response = await axios.get('https://timeapi.io/api/Time/current/zone?timeZone=UTC');
      const externalTime = response.data.dateTime;
  
      // Convert the external time (in UTC) to your local time (e.g., 'Europe/Amsterdam')
      const localTime = moment.utc(externalTime).tz('Europe/Amsterdam').format();
  
      console.log('External time in local time:', localTime);
    } catch (error) {
      console.error('Error fetching external time:', error);
    }
  };
  
  getExternalTime();
  
  
// Route to enable MFA for the user (including TOTP or email options)
app.post('/api/enable-mfa', (req, res) => {
    const { email, mfaChoice } = req.body;

    if (mfaChoice === 'totp') {
        res.status(200).send({ message: 'TOTP MFA enabled successfully' });
    } else if (mfaChoice === 'email') {
        res.status(200).send({ message: 'Email MFA enabled successfully' });
    } else {
        res.status(400).send({ error: 'Invalid MFA choice' });
    }
});

//Route to verify mfa
app.post('/api/verify-mfa', async (req, res) => {
    const { email, otp } = req.body; // Get email and token from the request
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.mfa_secret) {
            return res.status(400).json({ success: false, message: 'MFA not set up for this user' });
        }
        // Verify the token using TOTP or any other method you use
        const isValid = otplib.authenticator.verify({
        secret: user.mfa_secret, // Assume user has a stored secret for TOTP
        token: otp, // Token received from the frontend
        });
        if (isValid) {
        return res.json({ success: true, message: 'MFA verified successfully' });
        } else {
        return res.status(400).json({ success: false, message: 'Invalid MFA token' });
        }
    } catch (error) {
        console.error('Error verifying MFA:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
    });

// Route to toggle MFA (enable/disable) for the user
app.post('/api/toggle-mfa', async (req, res) => {
    try {
        const { email, action } = req.body;

        if (!email || !action) {
            return res.status(400).json({ message: 'Email and action are required' });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (action === "enable") {
            // Enable MFA, update the database (you could choose the method here, like 'totp' or 'email')
            db.query('UPDATE users SET mfa_enabled = ? WHERE email = ?', [true, email], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error enabling MFA' });
                }
                res.status(200).json({ message: 'MFA enabled successfully' });
            });
        } else if (action === "disable") {
            // Disable MFA, remove the MFA data (mfa_secret, mfa_enabled) from the user
            db.query('UPDATE users SET mfa_enabled = ?, mfa_secret = ? WHERE email = ?', [false, null, email], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error disabling MFA' });
                }
                res.status(200).json({ message: 'MFA disabled successfully' });
            });
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        console.error('Error toggling MFA:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/send-mfa-code', (req, res) => {
    const { email } = req.body;

    // Genereer een 6-cijferige code en stel een vervaltijd in
    const mfaCode = crypto.randomInt(100000, 999999).toString();
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minuten geldig
    // Update de database met de gegenereerde code
    db.query('UPDATE users SET mfa_code = ?, mfa_expiry = ? WHERE email = ?', [mfaCode, expirationTime, email], (err) => {
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

app.post('/api/verify-mfa-email', (req, res) => {
    const { email, code } = req.body;
    // Haal de opgeslagen code en vervaltijd op uit de database
    db.query('SELECT mfa_code, mfa_expiry FROM users WHERE email = ?', [email], (err, results) => {
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
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const mailOptions = {
                    to: user.email,
                    from: 'passwordreset@solarpanelsimulation.com',
                    subject: 'Password Reset Request',
                    text: `Hello ${user.name},\n\n` + 
                          `You are receiving this email because we received a request to reset the password for your account.\n\n` +
                          `To reset your password, please click on the following link or paste it into your browser:\n\n` +
                          `http://localhost:3000/reset/${token}\n\n` +
                          `This link will expire in one hour. If you did not request this, please ignore this email and your password will remain unchanged.\n\n` +
                          `Best regards,\n` +
                          `The Solar Panel Simulation Team\n` +
                          `For questions or support, please contact us at solarpanelsimulation@gmail.com\n`,
                    html: `<h2>Password Reset Request</h2>
                           <p>Hello ${user.name},</p>
                           <p>You are receiving this email because we received a request to reset the password for your account.</p>
                           <p>To reset your password, please click on the following link or paste it into your browser:</p>
                           <p><a href="http://localhost:3000/reset/${token}">Reset Password</a></p>
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

// Feedback endpoint: store feedback in the database and send an email
app.post('/api/feedback', rateLimiter, (req, res) => {
    const { name, email, comments, rating, category, anonymous } = req.body;

    // Validation for non-anonymous users
    if (!comments || !rating || !category || (anonymous !== true && (!name || !email))) {
        return res.status(400).send('Required fields are missing');
    }

    // Use placeholders for anonymous submissions
    const finalName = anonymous ? 'Anonymous' : name;
    const finalEmail = anonymous ? 'anonymous@noemail.com' : email;

    // Insert feedback into the database
    const feedbackQuery = 'INSERT INTO feedback (name, email, comments, rating, category) VALUES (?, ?, ?, ?, ?)';
    db.query(feedbackQuery, [finalName, finalEmail, comments, rating, category], (err, result) => {
        if (err) {
            console.error('Database insertion error:', err);
            return res.status(500).send('An error occurred while saving feedback to the database');
        }

        // Nodemailer setup for feedback email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: process.env.EMAIL_USER,
            from: 'noreply@solarpanelsimulation.com',
            subject: 'New Feedback Received',
            text: `Feedback received from ${finalName} (${finalEmail}):\n\nCategory: ${category}\nRating: ${rating}\nComments: ${comments}`,
            html: `<h2>New Feedback Received</h2>
                   <p><strong>Name:</strong> ${finalName}</p>
                   <p><strong>Email:</strong> ${finalEmail}</p>
                   <p><strong>Category:</strong> ${category}</p>
                   <p><strong>Rating:</strong> ${rating}</p>
                   <p><strong>Comments:</strong> ${comments}</p>`
        };

        // Send the email with feedback details
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending feedback email:', err);
                return res.status(500).send('An error occurred while sending the feedback email');
            }
            // Respond to the client after successful database insertion and email
            res.status(200).send('Feedback successfully saved and email sent');
        });
    });
});

// Chatbot API endpoint
const transporter = nodemailer.createTransport({
    service: 'gmail', // Example using Gmail, adjust for your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

app.post('/api/send-email', (req, res) => {
    const { name, email, topic, question } = req.body;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: process.env.EMAIL_USER,
        subject: `New inquiry from ${name || 'Anonymous'}`,
        text: `Topic: ${topic}\nQuestion: ${question}\nEmail: ${email}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error); // Log the error
            return res.status(500).json({ message: 'Failed to send email', error });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: 'Email sent successfully', info });
        }
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
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
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
    db.query('SELECT id, name, email, phoneNumber, location, bio, gender, dob, notifications, mfa_enabled, mfa_secret FROM users WHERE id = ?', [userId], (err, results) => {
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
              notifications: user.notifications || [],
              mfa_enabled: user.mfa_enabled || false
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
let pendingMfaSecrets = {}; // Temporary storage for pending MFA secrets, ideally use a more persistent storage for production

// --------------------------------------------------------------------SIMULATION SECTION

//Get simulation data from database
app.post("/api/simulatie", verifyToken, (req, res) => {
    const { 
      user_id,
      energy_usage,
      house_size,
      insulation_level,
      battery_capacity,
      battery_efficiency,
      charge_rate,
      energy_cost,
      return_rate,
      use_dynamic_prices,
    } = req.body;
  
    db.query(
      "INSERT INTO simulatie (user_id, energy_usage, house_size, insulation_level, battery_capacity, battery_efficiency, charge_rate, energy_cost, return_rate, use_dynamic_prices) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [user_id, energy_usage, house_size, insulation_level, battery_capacity, battery_efficiency, charge_rate, energy_cost, return_rate, use_dynamic_prices],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error saving simulatie.");
        }
        res.status(201).send("Simulatie saved successfully.");
      }
    );
  });
  

  // Route om de simulaties van een gebruiker op te halen
  app.get("/api/simulatie/:userId", verifyToken, (req, res) => {
    const { userId } = req.params;
  
    db.query(
      "SELECT * FROM simulatie WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Fout bij het ophalen van gegevens.");
        }
        res.status(200).json(results);
      }
    );
  });

  //Get simulation data from database
  app.get("/api/simulatie/:userId", verifyToken, (req, res) => {
    const { userId } = req.params;
  
    db.query(
      "SELECT * FROM simulatie WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Fout bij het ophalen van gegevens.");
        }
        res.status(200).json(results);
      }
    );
  });
  


// Route to fetch today's prices
app.get('/api/today-prices', async (req, res) => {
  try {
    const response = await axios.get(todayURL);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});


// Route to fetch monthly prices
app.get('/api/monthly-prices', async (req, res) => {
  try {
    const response = await axios.get(monthURL);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});