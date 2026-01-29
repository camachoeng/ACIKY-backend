const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Public routes - no authentication required
router.get('/', statsController.getCommunityStats); // Root stats endpoint
router.get('/community', statsController.getCommunityStats); // Alias for clarity

module.exports = router;
