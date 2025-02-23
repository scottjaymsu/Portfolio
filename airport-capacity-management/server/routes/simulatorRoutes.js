const express = require('express');
const simulatorController = require('../controllers/simulatorController');

const router = express.Router();

// Endpoint to get FBOs from airport_parking table
router.get('/getAirportFBOs/:airportCode', simulatorController.getAirportFBOs);
router.get('/getNetjetsFleet', simulatorController.getNetjetsFleet);

router.get('/getAllPlanes/:airportCode', simulatorController.getAllPlanes);



// Rec Engine
router.get('/getRecommendations/:airportCode', simulatorController.getRecommendations);



module.exports = router;
