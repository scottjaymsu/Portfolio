const express = require('express');
const simulatorController = require('../controllers/simulatorController');

const router = express.Router();

// Endpoint to get FBOs from airport_parking table
router.get('/getAirportFBOs/:iata_code', simulatorController.getAirportFBOs);


module.exports = router;


