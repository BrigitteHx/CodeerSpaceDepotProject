const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const crypto = require('crypto');
const otplib = require('otplib');
const QRCode = require('qrcode');
const { transporter } = require('../utils/transporter');
const { JWT_SECRET } = require('../config/constants');
const { getUserByEmail } = require('../utils/databaseHelpers');
const pendingEmails = new Set();


exports.register = (req, res) => {
    const { email, name, password, phoneNumber, location } = req.body;

    if (!email || !name || !password || !phoneNumber || !location) {
        return res.status(400).send('All fields are required');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    db.query('INSERT INTO users (email, name, password, phoneNumber, location) VALUES (?, ?, ?, ?, ?)',
        [email, name, hashedPassword, phoneNumber, location], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error registering user');
            }
            res.status(200).send('User registered successfully');
        });
};

exports.login = (req, res) => {
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
         const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
         
        // Check MFA status
        if (user.mfa_enabled && user.mfa_secret || user.mfa_enabled && user.mfa_method === 'email') {
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
};



let pendingMfaSecrets = {}; // Temporary storage for MFA secrets

// Setup TOTP and generate QR Code
exports.setupTOTP = async (req, res) => {
    const { email } = req.body;
    const appName = 'Solar Panel Simulatie';

    try {
        const secret = otplib.authenticator.generateSecret();
        const otpauthUrl = otplib.authenticator.keyuri(email, appName, secret);

        // Temporarily store secret
        pendingMfaSecrets[email] = secret;

        // Generate QR code
        QRCode.toDataURL(otpauthUrl, (err, data_url) => {
            if (err) {
                console.error('Error generating QR Code:', err);
                return res.status(500).json({ message: 'Failed to generate QR code' });
            }
            res.status(200).json({ qrCodeUrl: otpauthUrl, secret });
        });
    } catch (error) {
        console.error('Error setting up TOTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify TOTP
exports.verifyTOTP = (req, res) => {
    const { email, otp } = req.body;

    try {
        const secret = pendingMfaSecrets[email];
        if (!secret) {
            return res.status(400).json({ message: 'No pending MFA setup for this email' });
        }

        const isValid = otplib.authenticator.verify({ token: otp, secret });
        if (isValid) {
            // Save MFA settings in the database
            db.query(
                'UPDATE users SET mfa_secret = ?, mfa_enabled = 1 WHERE email = ?',
                [secret, email],
                (err) => {
                    if (err) {
                        console.error('Error updating MFA settings:', err);
                        return res.status(500).json({ message: 'Failed to save MFA settings' });
                    }
                    delete pendingMfaSecrets[email];
                    res.status(200).json({ message: 'MFA setup completed successfully' });
                }
            );
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Enable MFA
exports.enableMFA = (req, res) => {
    const { email, mfaChoice } = req.body;

    if (mfaChoice === 'totp') {
        res.status(200).send({ message: 'TOTP MFA enabled successfully' });
    } else if (mfaChoice === 'email') {
        res.status(200).send({ message: 'Email MFA enabled successfully' });
    } else {
        res.status(400).send({ error: 'Invalid MFA choice' });
    }
};

// Verify MFA
exports.verifyMFA = async (req, res) => {
    const { email, otp } = req.body; // Receiving `email` and `otp` from the request
    try {
        const user = await getUserByEmail(email); // Query user from the database
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.mfa_secret) {
            return res.status(400).json({ success: false, message: 'MFA not set up for this user' });
        }
        const isValid = otplib.authenticator.verify({
            secret: user.mfa_secret,
            token: otp, // Compare the received OTP with the stored secret
        });

        if (isValid) {
            return res.json({ success: true, message: 'MFA verified successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid MFA token' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


// Setup MFA via email
exports.setupMFAbyEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        // Generate a 6-digit random code
        const mfaCode = crypto.randomInt(100000, 999999).toString();
        const expirationTime = Date.now() + 5 * 60 * 1000; // Code valid for 5 minutes
        // Store the code and expiry in the database
        db.query(
            'UPDATE users SET temp_mfa_secret = ?, temp_mfa_expiry = ? WHERE email = ?',
            [mfaCode, expirationTime, email],
            (err) => {
                if (err) {
                    console.error('Error saving MFA code:', err);
                    return res.status(500).json({ message: 'Failed to set up MFA' });
                }
                // Send the code via email
                transporter.sendMail(
                    {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: 'Your MFA Verification Code',
                        text: `Your MFA code is: ${mfaCode}. This code is valid for 5 minutes.`,
                    },
                    (mailErr) => {
                        if (mailErr) {
                            console.error('Error sending email:', mailErr);
                            return res.status(500).json({ message: 'Failed to send MFA email' });
                        }

                        res.status(200).json({ message: 'MFA code sent to your email' });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Error setting up Email MFA:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify MFA code
exports.verifyMFAEmail = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required' });
    }

    try {
        // Retrieve the stored MFA code and its expiry
        db.query(
            'SELECT temp_mfa_secret, temp_mfa_expiry FROM users WHERE email = ?',
            [email],
            (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const { temp_mfa_secret, temp_mfa_expiry } = results[0];

                if (!temp_mfa_secret || temp_mfa_secret !== code) {
                    return res.status(400).json({ message: 'Invalid MFA code' });
                }

                if (Date.now() > temp_mfa_expiry) {
                    return res.status(400).json({ message: 'MFA code expired' });
                }

                // Mark MFA as verified and clear temporary data
                db.query(
                    'UPDATE users SET mfa_enabled = 1, mfa_method = "email", temp_mfa_secret = NULL, temp_mfa_expiry = NULL WHERE email = ?',
                    [email],
                    (updateErr) => {
                        if (updateErr) {
                            console.error('Error updating MFA status:', updateErr);
                            return res.status(500).json({ message: 'Failed to enable MFA' });
                        }

                        res.status(200).json({ message: 'MFA verified successfully' });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Error verifying Email MFA:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.verifyEmailMFA = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    // Query the database for the MFA code and expiry
    db.query('SELECT mfa_code, mfa_expiry FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { mfa_code, mfa_expiry } = results[0];

        if (!mfa_code || mfa_code !== code) {
            return res.status(400).json({ success: false, message: 'Invalid MFA code' });
        }

        if (Date.now() > mfa_expiry) {
            return res.status(400).json({ success: false, message: 'MFA code expired' });
        }

        // Clear the MFA code after successful verification
        db.query('UPDATE users SET mfa_code = NULL, mfa_expiry = NULL WHERE email = ?', [email], (updateErr) => {
            if (updateErr) {
                console.error('Error clearing MFA code:', updateErr);
                return res.status(500).json({ success: false, message: 'Failed to clear MFA code' });
            }

            res.status(200).json({ success: true, message: 'MFA verified successfully' });
        });
    });
};
exports.checkMFAStatus= async (req, res) => {
    const { email } = req.body;
    try {
        // Logic to check MFA status
        const user = await getUserByEmail(email);
        if (!user) throw new Error('User not found');
        const mfaStatus = await checkMFAStatus(user);
        res.status(200).json({ mfaStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while checking MFA status' });
    }
};
exports.checkMFAEnabled = async (req, res) => {
    const { email } = req.body;
    try {
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
};
exports.sendMFACode = async (req, res) => {
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
};

// disable MFA
exports.disableMFA = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if the user exists
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the database to disable MFA
        db.query(
            'UPDATE users SET mfa_enabled = ?,mfa_method = NULL, mfa_secret = NULL, mfa_code = NULL, mfa_expiry = NULL WHERE email = ?',
            [false, email],
            (err) => {
                if (err) {
                    console.error('Error disabling MFA:', err);
                    return res.status(500).json({ message: 'Server error disabling MFA' });
                }
                res.status(200).json({ message: 'MFA disabled successfully' });
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};