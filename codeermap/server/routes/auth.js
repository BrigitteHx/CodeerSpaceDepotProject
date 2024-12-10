const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Route for user login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Access the database connection from req.db
  const db = req.db;

  // Query the database for the user by email
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = results[0];

    // Compare the password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send('Invalid password');
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 }); // 24 hours
    res.status(200).send({ auth: true, token });
  });
});

// Route for TOTP setup
router.post('/setup-totp', (req, res) => {
  const { email } = req.body;

  // Generate a TOTP secret
  const secret = speakeasy.generateSecret({ length: 20, name: email }); // Use email as part of the secret

  // Generate a QR code for the user to scan with their authenticator app
  QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) {
      return res.status(500).send('Failed to generate QR code');
    }
    res.status(200).send({ qrCodeUrl: data_url, secret: secret.base32 });
  });
});

// Route to verify TOTP token
router.post('/verify-totp', (req, res) => {
    const { email, token, secret } = req.body;
  
    if (!token || !secret) {
      return res.status(400).send('OTP and secret are required');
    }
  
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token
    });
  
    if (verified) {
      res.status(200).send({ message: 'TOTP verified successfully, MFA enabled.' });
    } else {
      res.status(400).send({ message: 'Invalid TOTP token' });
    }
  });

// Export the router
module.exports = router;
