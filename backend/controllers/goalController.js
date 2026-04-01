const Goal = require('../models/Goal');
const WeightLog = require('../models/WeightLog');

// @desc    Get active goals for user
// @route   GET /api/goals
const getActiveGoals = async (req, res) => {
    try {
        const goals = await Goal.find({
            userId: req.user.id,
            status: 'active'
        });
        
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create weight goal
// @route   POST /api/goals/weight
const createWeightGoal = async (req, res) => {
    try {
        const { targetWeight, startWeight, targetDate } = req.body;
        
        // Get most recent weight if startWeight not provided
        let start = startWeight;
        if (!start) {
            const recent = await WeightLog.findOne({ userId: req.user.id })
                .sort({ date: -1 });
            start = recent ? recent.weight : null;
        }
        
        const goal = await Goal.create({
            userId: req.user.id,
            type: 'weight',
            targetWeight,
            startWeight: start,
            targetDate,
            status: 'active'
        });
        
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create calorie goal
// @route   POST /api/goals/calorie
const createCalorieGoal = async (req, res) => {
    try {
        const { dailyCalorieTarget } = req.body;
        
        const goal = await Goal.create({
            userId: req.user.id,
            type: 'calorie',
            dailyCalorieTarget,
            status: 'active'
        });
        
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update goal progress
// @route   GET /api/goals/progress
const getGoalProgress = async (req, res) => {
    try {
        const goals = await Goal.find({
            userId: req.user.id,
            status: 'active'
        });
        
        const progress = [];
        
        for (const goal of goals) {
            if (goal.type === 'weight') {
                const latestWeight = await WeightLog.findOne({ userId: req.user.id })
                    .sort({ date: -1 });
                
                if (latestWeight && goal.startWeight) {
                    const totalChange = goal.targetWeight - goal.startWeight;
                    const currentChange = latestWeight.weight - goal.startWeight;
                    const percentage = totalChange === 0 ? 0 : 
                        Math.min(100, Math.max(0, (currentChange / totalChange) * 100));
                    
                    progress.push({
                        goalId: goal._id,
                        type: 'weight',
                        current: latestWeight.weight,
                        target: goal.targetWeight,
                        percentage: Math.round(percentage)
                    });
                }
            } else if (goal.type === 'calorie') {
                // Daily calorie progress calculated on frontend with daily meals
                progress.push({
                    goalId: goal._id,
                    type: 'calorie',
                    target: goal.dailyCalorieTarget
                });
            }
        }
        
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getActiveGoals,
    createWeightGoal,
    createCalorieGoal,
    getGoalProgress
};