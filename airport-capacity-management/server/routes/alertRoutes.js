/**
 * Routes for alert data queries
 */
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/getAlert/:id/:fbo', alertController.getAlert);
router.get('/getFBOs/:id', alertController.getFBOs);
module.exports = router;