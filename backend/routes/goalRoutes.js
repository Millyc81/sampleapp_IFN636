const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getActiveGoals,
    createWeightGoal,
    createCalorieGoal,
    getGoalProgress
} = require('../controllers/goalController');

router.get('/', protect, getActiveGoals);
router.get('/progress', protect, getGoalProgress);
router.post('/weight', protect, createWeightGoal);
router.post('/calorie', protect, createCalorieGoal);

module.exports = router;