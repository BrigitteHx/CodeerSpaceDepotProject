const express = require('express');
const { addBattery, readBatteries } = require('../controllers/batteryController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Route to add a new battery
router.post('/addBattery', verifyToken, addBattery);

// Route to read batteries for the logged-in user
router.get('/readBatteries', verifyToken, readBatteries);

module.exports = router;
