const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Public route - no authentication required
router.get('/community', statsController.getCommunityStats);

module.exports = router;
