const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', routeController.getAllRoutes);
router.get('/:id', routeController.getRouteById);

// Admin routes
router.post('/', requireAdmin, routeController.createRoute);
router.put('/:id', requireAdmin, routeController.updateRoute);
router.delete('/:id', requireAdmin, routeController.deleteRoute);

module.exports = router;
