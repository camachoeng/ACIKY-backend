const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { requireAdmin } = require('../middleware/auth');

// Public routes
router.post('/', testimonialController.createTestimonial);
router.get('/approved', testimonialController.getApprovedTestimonials);

// Admin routes
router.get('/all', requireAdmin, testimonialController.getAllTestimonials);
router.put('/:id/status', requireAdmin, testimonialController.updateTestimonialStatus);
router.put('/:id/featured', requireAdmin, testimonialController.toggleFeatured);
router.delete('/:id', requireAdmin, testimonialController.deleteTestimonial);

module.exports = router;
