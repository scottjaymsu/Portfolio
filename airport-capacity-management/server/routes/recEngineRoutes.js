const express = require('express');
const recEngineController = require('../controllers/recEngineController');

const router = express.Router();

router.get('/upcomingDepartingFlights/:iata_code/:airline?', recEngineController.upcomingDepartingFlights);
router.get('/getPlanesAtAirport/:iata_code/:airline?', recEngineController.getPlanesAtAirport);
router.get('/getAllPlanes', recEngineController.getAllPlanes);
router.get('/getPlaneInformation/:tail_number', recEngineController.getPlaneInformation);
router.get('/getAirportFBOs/:iata_code', recEngineController.getAirportFBOs);
router.get('/getFBOInformation/:id', recEngineController.getFBOInformation);
router.get('/getAirportInformation/:iata_code', recEngineController.getAirportInformation);

module.exports = router;