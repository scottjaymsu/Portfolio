/**
 * Routes for airport data queries
 */
const express = require('express');
const router = express.Router();
const airportDataController = require('../controllers/airportDataController');

router.get('/getAirportData/:id', airportDataController.getAirportData);
router.get('/getCurrentCapacity/:id', airportDataController.getCurrentCapacity);
router.get('/getOverallCapacity/:id', airportDataController.getOverallCapacity);

module.exports = router;