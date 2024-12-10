const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken');

router.get('/user-info', verifyToken, (req, res) => {
  // Access the userId from the token (set by the middleware)
  const userId = req.userId;

  // Access the database connection from req.db
  const db = req.db;

  // Query your MySQL database to get user data by userId, including bio, gender, and dob
  db.query('SELECT id, name, email, phoneNumber, location, bio, gender, dob, profilePicture, notifications, mfa_enabled, mfa_secret FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).send('Error querying the database.');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found.');
    }

    const user = results[0];
    res.status(200).json({ user });
  });
});

module.exports = router;
