const express = require('express');
const { 
    saveSimulation, 
    getSimulationDataByUserId, 
} = require('../controllers/simulationController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();


router.post('/save', verifyToken, saveSimulation);
router.get('/user', verifyToken, getSimulationDataByUserId);

module.exports = router;