/**
 * Routes for airport data queries
 */
const express = require('express');
const router = express.Router();
const airportDataController = require('../controllers/AirportDataController');

router.get('/getAirportData/ident', airportDataController.getAirportData);
router.get('/getCurrentCapacity/ident', airportDataController.getCurrentCapacity);
router.get('/getOverallCapacity/ident', airportDataController.getOverallCapacity);

module.exports = router;