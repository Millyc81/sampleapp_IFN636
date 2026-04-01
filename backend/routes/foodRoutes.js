const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    searchFoods,
    getFoodById,
    getFoodByBarcode,
    createCustomFood,
    deleteCustomFood
} = require('../controllers/foodController');

router.get('/search', protect, searchFoods);
router.get('/barcode/:code', protect, getFoodByBarcode);
router.get('/:id', protect, getFoodById);
router.post('/custom', protect, createCustomFood);
router.delete('/custom/:id', protect, deleteCustomFood);

module.exports = router;