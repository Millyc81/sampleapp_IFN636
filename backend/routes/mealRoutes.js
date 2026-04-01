const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addFoodToMeal,
    getMealsByDate,
    getDailySummary,
    removeFoodFromMeal
} = require('../controllers/mealController');

// All routes require authentication
router.use(protect);

// Routes
router.post('/', addFoodToMeal);
router.get('/', getMealsByDate);
router.get('/summary', getDailySummary);
router.delete('/:mealId/items/:itemId', removeFoodFromMeal);

module.exports = router;