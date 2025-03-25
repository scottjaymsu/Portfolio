const express = require('express');
const parkingPriorityController = require('../controllers/parkingPriority');
const router = express.Router();

router.patch('/updateParkingPriorities', parkingPriorityController.updateParkingPriorities);

module.exports = router;