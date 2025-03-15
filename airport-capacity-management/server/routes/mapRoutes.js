const express = require('express');
const mapController = require('../controllers/mapController');

const router = express.Router();

router.get('getCurrentAirportStatus', mapController.getCurrentAirportStatus);
router.get('/getAirportMarkers', mapController.getAirportMarkers);
router.get('/getSmallAirportMarkers', mapController.getSmallAirportMarkers);

module.exports = router;