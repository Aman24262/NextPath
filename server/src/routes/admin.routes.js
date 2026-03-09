const express = require('express');
const { createCareer, createQuestion } = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

// Apply BOTH middlewares to all routes in this file
router.use(protect);
router.use(authorize('Admin'));

// Define the routes
router.post('/careers', createCareer);
router.post('/questions', createQuestion);

module.exports = router;