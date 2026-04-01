const Food = require('../models/Food');

// @desc    Search foods by name
// @route   GET /api/foods/search?q=apple&category=fruits
const searchFoods = async (req, res) => {
    try {
        const { q, category, limit = 20 } = req.query;
        
        let query = {};
        
        if (q) {
            query.name = { $regex: q, $options: 'i' };
        }
        
        if (category) {
            query.category = category;
        }
        
        // Include both system foods and user's custom foods
        if (req.user) {
            query.$or = [
                { isCustom: false },
                { isCustom: true, createdBy: req.user.id }
            ];
        } else {
            query.isCustom = false;
        }
        
        const foods = await Food.find(query)
            .limit(parseInt(limit))
            .select('name brand calories protein carbs fat servingSize');
        
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get food by ID
// @route   GET /api/foods/:id
const getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        
        res.json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get food by barcode
// @route   GET /api/foods/barcode/:code
const getFoodByBarcode = async (req, res) => {
    try {
        const food = await Food.findOne({ barcode: req.params.code });
        
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        
        res.json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create custom food
// @route   POST /api/foods/custom
const createCustomFood = async (req, res) => {
    try {
        const { name, calories, protein, carbs, fat, servingSize } = req.body;
        
        const food = await Food.create({
            name,
            calories,
            protein,
            carbs,
            fat,
            servingSize,
            isCustom: true,
            createdBy: req.user.id
        });
        
        res.status(201).json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete custom food
// @route   DELETE /api/foods/custom/:id
const deleteCustomFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        
        // Check if user owns this custom food
        if (food.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await food.deleteOne();
        res.json({ message: 'Food deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    searchFoods,
    getFoodById,
    getFoodByBarcode,
    createCustomFood,
    deleteCustomFood
};