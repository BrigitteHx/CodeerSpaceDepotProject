const nodemailer = require('nodemailer');
 // Send the secret to the user's email
 const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email service if needed
    auth: {
        user: process.env.EMAIL_USER, // Use environment variables for email credentials
        pass: process.env.EMAIL_PASS,
    },
});

// Export the transporter for use in other files
module.exports = {
    transporter,
};