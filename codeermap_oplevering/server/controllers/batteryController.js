const db = require('../config/db');

// Add a new battery to the database
exports.addBattery = (req, res) => {
    const { name, capacity, installationDate } = req.body;

    // Validate required fields
    if (!name || !capacity || !installationDate) {
        console.error('Missing required fields');
        return res.status(400).json({ error: 'All fields are required' });
    }

    const userId = req.userId; // Retrieved from JWT token middleware

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
        res.status(201).json({ message: 'Battery added successfully' });
    });
};

// Retrieve batteries for the logged-in user
exports.readBatteries = (req, res) => {
    const userId = req.userId; // Retrieved from JWT token middleware

    if (!userId) {
        console.error('Missing user ID');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const sql = 'SELECT * FROM battery WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching batteries:', err);
            return res.status(500).json({ error: 'Failed to fetch batteries' });
        }
        res.json(results);
    });
};
