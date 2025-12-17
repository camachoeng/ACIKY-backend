const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', galleryController.getAllImages);

// Admin routes
router.get('/all', requireAdmin, galleryController.getAllImagesAdmin);
router.post('/', requireAdmin, galleryController.createImage);
router.put('/:id', requireAdmin, galleryController.updateImage);
router.delete('/:id', requireAdmin, galleryController.deleteImage);

module.exports = router;
