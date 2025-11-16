const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', activityController.getAllActivities);
router.get('/:id', activityController.getActivityById);

// Admin routes
router.post('/', requireAdmin, activityController.createActivity);
router.put('/:id', requireAdmin, activityController.updateActivity);
router.delete('/:id', requireAdmin, activityController.deleteActivity);

module.exports = router;
