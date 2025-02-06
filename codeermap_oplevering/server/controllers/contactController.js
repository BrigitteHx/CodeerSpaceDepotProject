const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/contact', (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        console.log("Validation error: Missing required fields");
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  // Laadt de e-mail uit de omgevingsvariabelen
            pass: process.env.EMAIL_PASS   // Laadt het wachtwoord uit de omgevingsvariabelen
        }
    });

    const companyMailOptions = {
        from: email,
        to: 'contactpaginatest@gmail.com',
        subject: `New Contact Request from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`
    };

    console.log("Attempting to send email to company...");

    transporter.sendMail(companyMailOptions, (error, info) => {
        if (error) {
            console.error('Error during company email send:', error.message);
            return res.status(500).json({ message: 'Error sending the email to the company.' });
        }
        console.log('Email sent to company successfully:', info.response);

        const userMailOptions = {
            from: 'no-reply@contactpaginatest.com',
            to: email,
            subject: 'Your Contact Request has been Received!',
            text: `Hello ${name},\n\nThank you for reaching out! We've received your message:\n\n"${message}"\n\nOur team will get back to you soon.\n\nBest regards,\nCompany Support`
        };

        console.log("Attempting to send confirmation email to user...");

        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Error during confirmation email send:', error.message);
                return res.status(500).json({ message: 'Error sending confirmation email to user.' });
            }
            console.log('Confirmation email sent to user successfully:', info.response);
            res.status(200).json({ message: 'Message successfully sent!' });
        });
    });
});

module.exports = router;
