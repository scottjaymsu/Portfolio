/**
 * Routes for airport data queries
 */
const express = require('express');
const router = express.Router();
const airportDataController = require('../controllers/AirportDataController');

router.get('/getAirportData/ident', airportDataController.getAirportData);

module.exports = router;