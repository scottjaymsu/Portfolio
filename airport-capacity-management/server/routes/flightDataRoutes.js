/**
 * Routes for flight data queries
 */
const express = require('express');
const router = express.Router();
const flightDataController = require('../controllers/flightDataController');

router.get('/getArrivingFlights/:id', flightDataController.getArrivingFlights);
router.get('/getDepartingFlights/:id', flightDataController.getDepartingFlights);

module.exports = router;