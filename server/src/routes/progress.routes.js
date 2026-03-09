const express = require('express');
const { updateTaskStatus } = require('../controllers/progress.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// The URL includes both the Roadmap ID and the specific Task ID
router.put('/:roadmapId/task/:taskId', protect, updateTaskStatus);

module.exports = router;