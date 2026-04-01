const Food = require('../models/Food');

// @desc    Search foods by name
// @route   GET /api/foods/search?q=apple
const searchFoods = async (req, res) => {
    try {
        const { q, limit = 50 } = req.query;
        
        console.log('🔍 Search query:', q);
        
        let query = {};
        if (q) {
            query.name = { $regex: q, $options: 'i' };
        }
        
        const foods = await Food.find(query).limit(parseInt(limit));
        
        console.log(`📦 Found ${foods.length} foods`);
        res.json(foods);
    } catch (error) {
        console.error('Search error:', error);
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
        console.error('Get food error:', error);
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
        console.error('Barcode lookup error:', error);
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
            protein: protein || 0,
            carbs: carbs || 0,
            fat: fat || 0,
            servingSize: servingSize || { amount: 100, unit: 'g' },
            isCustom: true,
            createdBy: req.user.id
        });
        
        res.status(201).json(food);
    } catch (error) {
        console.error('Create custom food error:', error);
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
        if (food.createdBy && food.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await food.deleteOne();
        res.json({ message: 'Food deleted' });
    } catch (error) {
        console.error('Delete custom food error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Debug - count foods in database
// @route   GET /api/foods/debug/count
const debugCount = async (req, res) => {
    try {
        const totalCount = await Food.countDocuments();
        const customCount = await Food.countDocuments({ isCustom: true });
        const systemCount = await Food.countDocuments({ isCustom: false });
        
        const sample = await Food.find({}).limit(5).select('name category');
        
        res.json({
            total: totalCount,
            custom: customCount,
            system: systemCount,
            sample: sample.map(f => ({ name: f.name, category: f.category }))
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    searchFoods,
    getFoodById,
    getFoodByBarcode,
    createCustomFood,
    deleteCustomFood,
    debugCount
};