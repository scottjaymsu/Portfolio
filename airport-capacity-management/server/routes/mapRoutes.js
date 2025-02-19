const express = require('express');
const simulatorController = require('../controllers/mapController');

const router = express.Router();

router.get('getCurrentAirportStatus', simulatorController.getCurrentAirportStatus);