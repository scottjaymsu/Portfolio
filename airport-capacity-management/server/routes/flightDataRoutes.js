/**
 * Routes for flight data queries
 */
const express = require('express');
const router = express.Router();
const flightDataController = require('../controllers/flightDataController');

router.get('/getArrivingFlights', flightDataController.getArrivingFlights);

module.exports = router;