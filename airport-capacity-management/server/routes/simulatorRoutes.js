const express = require('express');
const simulatorController = require('../controllers/simulatorController');

const router = express.Router();

// Endpoint to get FBOs from airport_parking table
router.get('/getAirportFBOs/:iata_code', simulatorController.getAirportFBOs);
// router.get('/getNetjetsFleet', simulatorController.getNetjetsFleet);
router.get('/getArrivingPlanes/:iata_code', simulatorController.getArrivingPlanes);

// Rec Engine
router.get('/getRecommendations/:iata_code', simulatorController.getRecommendations);
module.exports = router;


