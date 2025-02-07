const express = require('express');
const batchFileController = require('../controllers/batchFileController');

const router = express.Router();

router.post('/insertBatchData', batchFileController.insertBatchData);
router.post('/insertAirportData', batchFileController.insertAirportData);

module.exports = router;
