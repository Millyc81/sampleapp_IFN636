const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    searchFoods,
    getFoodById,
    getFoodByBarcode,
    createCustomFood,
    deleteCustomFood,
    debugCount
} = require('../controllers/foodController');

// Debug route (must come before other routes)
router.get('/debug/count', protect, debugCount);

// Search route
router.get('/search', protect, searchFoods);

// Barcode route
router.get('/barcode/:code', protect, getFoodByBarcode);

// Get food by ID
router.get('/:id', protect, getFoodById);

// Custom food routes
router.post('/custom', protect, createCustomFood);
router.delete('/custom/:id', protect, deleteCustomFood);

module.exports = router;