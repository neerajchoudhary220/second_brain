const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');

// Routes
router.get('/', memoryController.renderDashboard);
router.get('/memories', memoryController.renderAllMemories);
router.get('/memories/create', memoryController.renderCreateForm);
router.post('/memories', memoryController.createMemory);
router.get('/memories/:id', memoryController.renderDetail);
router.get('/memories/:id/edit', memoryController.renderEditForm);
router.post('/memories/:id/update', memoryController.updateMemory);
router.post('/memories/:id/delete', memoryController.deleteMemory);
router.get('/search', memoryController.globalSearch);

module.exports = router;
