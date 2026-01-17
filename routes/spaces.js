const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/spaceController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', spaceController.getAllSpaces);
router.get('/:id', spaceController.getSpaceById);

// Admin routes
router.post('/', requireAdmin, spaceController.createSpace);
router.put('/:id', requireAdmin, spaceController.updateSpace);
router.delete('/:id', requireAdmin, spaceController.deleteSpace);
router.post('/instructors/add', requireAdmin, spaceController.addInstructor);
router.post('/instructors/remove', requireAdmin, spaceController.removeInstructor);

module.exports = router;
