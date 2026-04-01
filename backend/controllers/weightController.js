const WeightLog = require('../models/WeightLog');

// @desc    Log weight
// @route   POST /api/weight
const logWeight = async (req, res) => {
    try {
        const { weight, date, notes } = req.body;
        
        const weightLog = await WeightLog.findOneAndUpdate(
            { userId: req.user.id, date: new Date(date) },
            { weight, notes },
            { upsert: true, new: true }
        );
        
        res.status(201).json(weightLog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get weight history
// @route   GET /api/weight?start=2024-01-01&end=2024-01-31
const getWeightHistory = async (req, res) => {
    try {
        const { start, end, limit = 30 } = req.query;
        
        let query = { userId: req.user.id };
        
        if (start) {
            query.date = { $gte: new Date(start) };
        }
        if (end) {
            query.date = { ...query.date, $lte: new Date(end) };
        }
        
        const weights = await WeightLog.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit));
        
        res.json(weights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { logWeight, getWeightHistory };