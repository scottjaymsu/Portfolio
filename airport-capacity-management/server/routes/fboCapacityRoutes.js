const express = require('express');
const router = express.Router();
const fboCapacityController = require('../controllers/fboCapacityController');
 
router.get('/getAirportParking/:Airport_Code', fboCapacityController.getAirportParking);
 
module.exports = router;
