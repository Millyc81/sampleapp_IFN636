const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMealsByDate,
    addFoodToMeal,
    removeFoodFromMeal,
    getDailySummary
} = require('../controllers/mealController');

router.get('/', protect, getMealsByDate);
router.get('/summary', protect, getDailySummary);
router.post('/', protect, addFoodToMeal);
router.delete('/:mealId/items/:itemId', protect, removeFoodFromMeal);

module.exports = router;