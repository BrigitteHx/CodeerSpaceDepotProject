const db = require('../config/db'); // Your database connection
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { transporter } = require('../utils/transporter');
const { getUserByEmail } = require('../utils/databaseHelpers');
const { RATE_LIMIT_WINDOW, RATE_LIMIT_REQUESTS } = require('../config/constants');
const rateLimiter = require('../middleware/rateLimiter');

exports.getUserInfo = (req, res) => {
    const userId = req.userId; // Extracted from the token by `verifyToken`

    // Ensure the query fetches MFA verification status and other necessary user details
    db.query('SELECT id, name, email, phoneNumber, location, bio, gender, dob, profilePicture, notifications, mfa_enabled, mfa_secret, mfa_method FROM users WHERE id = ?',  [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error fetching user data:', err);
            return res.status(404).send('User not found');
        }

        res.status(200).json(results[0]); // Send full user profile
        });
    };

exports.getUserProfile = (req, res) => {
    const userId = req.userId;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error fetching user profile:', err);
            return res.status(404).send('User not found');
        }
        res.status(200).json(results[0]); // Send full user profile
    });
};
// Update user profile
exports.updateUserProfile = (req, res) => {
    const userId = req.userId;
    const { name, email, phoneNumber, location, bio, gender, dob } = req.body;

    db.query(
        'UPDATE users SET name = ?, email = ?, phoneNumber = ?, location = ?, bio = ?, gender = ?, dob = ? WHERE id = ?',
        [name, email, phoneNumber, location, bio, gender, dob, userId],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update profile' });
            }
            res.status(200).json({ message: 'Profile updated successfully' });
        }
    );
};

// Delete user account
exports.deleteAccount = (req, res) => {
    const userId = req.userId;
    db.query('SELECT email, name FROM users WHERE id = ?', [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        transporter.sendMail({
            to: user.email,
            from: 'noreply@yourdomain.com',
            subject: 'Account Deletion Confirmation',
            text: `Hello ${user.name}, your account has been deleted.`,
        });

        db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error deleting account' });
            }
            res.status(200).json({ message: 'Account deleted successfully' });
        });
    });
};

// Upload profile picture
exports.uploadProfilePicture = (req, res) => {
    const userId = req.userId;
    const filePath = `/uploads/${req.file.filename}`;
    db.query('UPDATE users SET profilePicture = ? WHERE id = ?', [filePath, userId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update profile picture' });
        }
        res.status(200).json({ message: 'Profile picture updated', filePath });
    });
};

// Update notifications
exports.updateNotifications = (req, res) => {
    const userId = req.userId;
    const { notifications } = req.body;
    db.query('UPDATE users SET notifications = ? WHERE id = ?', [notifications, userId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update notifications' });
        }
        res.status(200).json({ message: 'Notifications updated successfully' });
    });
};

// Check if email exists
exports.checkEmail = (req, res) => {
    const { email } = req.body;
    const userId = req.userId;
    db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to check email' });
        }
        res.status(200).json({ exists: results.length > 0 });
    });
};

exports.toggleMFA = (req, res) => {
    const { email, action } = req.body;

    if (!email || !action) {
        return res.status(400).json({ message: 'Email and action are required' });
    }

    getUserByEmail(email).then(user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (action === "enable") {
            db.query('UPDATE users SET mfa_enabled = ? WHERE email = ?', [true, email], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error enabling MFA' });
                }
                res.status(200).json({ message: 'MFA enabled successfully' });
            });
        } else if (action === "disable") {
            db.query('UPDATE users SET mfa_enabled = ?, mfa_secret = ? WHERE email = ?', [false, null, email], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error disabling MFA' });
                }
                res.status(200).json({ message: 'MFA disabled successfully' });
            });
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    }).catch(error => {
        console.error('Error toggling MFA:', error);
        res.status(500).json({ message: 'Server error' });
    });
};
// Password reset request with rate limiting
exports.requestPasswordReset = (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send('Email is required');
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).send('Server error while querying the database');
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Email not registered' });
        }

        const user = results[0];
        const currentTime = new Date();
        const lastPasswordReset = user.lastPasswordReset ? new Date(user.lastPasswordReset) : null;

        const requestsToday = lastPasswordReset && (currentTime - lastPasswordReset < RATE_LIMIT_WINDOW) ? 1 : 0;
        if (requestsToday >= RATE_LIMIT_REQUESTS) {
            return res.status(429).json({ message: 'Too many password reset requests. Try again later.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiration = new Date(Date.now() + 3600000);

        db.query('UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ?, lastPasswordReset = ? WHERE email = ?', 
            [token, tokenExpiration, currentTime, email], (err) => {
                if (err) {
                    return res.status(500).send('Error saving token in the database');
                }

                const mailOptions = {
                    to: user.email,
                    from: 'passwordreset@solarpanelsimulation.com',
                    subject: 'Password Reset Request',
                    text: `Click the link to reset your password: http://localhost:3000/reset/${token}`,
                };

                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        return res.status(500).send('Error sending email');
                    }
                    res.status(200).send('Password reset email sent');
                });
            });
    });
};

// Reset password
exports.resetPassword = (req, res) => {
    const { token, newPassword } = req.body;
    
    db.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', 
    [token, Date.now()], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send({ message: 'Password reset token is invalid or has expired.' });
        }

        const user = results[0];
        const hashedPassword = bcrypt.hashSync(newPassword, 8);

        db.query('UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE email = ?', 
        [hashedPassword, user.email], (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error updating password' });
            }
            res.status(200).send({ message: 'Password has been updated successfully' });
        });
    });
};
