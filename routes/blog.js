const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', blogController.getAllPosts);
router.get('/:slug', blogController.getPostBySlug);

// Admin routes
router.post('/', requireAdmin, blogController.createPost);
router.put('/:id', requireAdmin, blogController.updatePost);
router.delete('/:id', requireAdmin, blogController.deletePost);

module.exports = router;
