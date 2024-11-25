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

const app = express();
const PORT = process.env.PORT || 5000;
const secretKey = process.env.JWT_SECRET || '77b22a07938ccbb0565abc929d9ee5726affa3c4b197ea58ed28374d8f42161cadf47f74a95a10099d9c9d72541fbea1f579ba123b68cb9021edf8046ce030c6'; // Use environment variable for the secret key

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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

// ----------------------------------------------------------------------------------------------------------------------------


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
            pass: 'whli rmte afix cjmr' // Replace with env var in production
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


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
