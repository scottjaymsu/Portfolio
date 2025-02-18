const express = require('express');
const simulatorController = require('../controllers/simulatorController');

const router = express.Router();

// Endpoint to get FBOs from airport_parking table
router.get('/getAirportFBOs/:iata_code', simulatorController.getAirportFBOs);
router.get('/getNetjetsFleet', simulatorController.getNetjetsFleet);


module.exports = router;


