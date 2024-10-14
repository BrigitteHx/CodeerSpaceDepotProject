const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database configuratie
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'depotproject_backend'
});

// Verbinden met de database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

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


// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Zoek de gebruiker op basis van het e-mailadres
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('User not found');
        }

        const user = results[0];

        // Vergelijk het wachtwoord
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send('Invalid password');
        }

        // Genereer een token
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: 86400 }); // 24 hours
        res.status(200).send({ auth: true, token: token });
    });
});

// Start de server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
