const Meal = require('../models/Meal');
const Food = require('../models/Food');

// @desc    Add food to meal
// @route   POST /api/meals
const addFoodToMeal = async (req, res) => {
    try {
        const { date, category, foodId, quantity } = req.body;
        
        console.log('Adding food to meal:', { date, category, foodId, quantity });
        
        // Get food details
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        
        // Calculate nutrition based on quantity (per 100g)
        const multiplier = quantity / 100;
        const calories = Math.round(food.calories * multiplier);
        const protein = Math.round(food.protein * multiplier * 10) / 10;
        const carbs = Math.round(food.carbs * multiplier * 10) / 10;
        const fat = Math.round(food.fat * multiplier * 10) / 10;
        
        // Find or create meal for this date and category
        let meal = await Meal.findOne({
            userId: req.user.id,
            date: new Date(date),
            category
        });
        
        if (!meal) {
            meal = new Meal({
                userId: req.user.id,
                date: new Date(date),
                category,
                items: []
            });
        }
        
        // Add food to meal
        meal.items.push({
            foodId,
            quantity,
            servingUnit: 'g',
            calories,
            protein,
            carbs,
            fat
        });
        
        await meal.save();
        
        // Populate food details before returning
        await meal.populate('items.foodId', 'name calories protein carbs fat');
        
        res.status(201).json(meal);
    } catch (error) {
        console.error('Add food error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get meals for a date
// @route   GET /api/meals?date=2024-01-15
const getMealsByDate = async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({ message: 'Date parameter is required' });
        }
        
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        
        const meals = await Meal.find({
            userId: req.user.id,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate('items.foodId', 'name calories protein carbs fat');
        
        // Group by category
        const grouped = {
            breakfast: null,
            lunch: null,
            dinner: null,
            snack: null
        };
        
        meals.forEach(meal => {
            grouped[meal.category] = meal;
        });
        
        res.json(grouped);
    } catch (error) {
        console.error('Get meals error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get daily nutrition summary
// @route   GET /api/meals/summary?date=2024-01-15
const getDailySummary = async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({ message: 'Date parameter is required' });
        }
        
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        
        const meals = await Meal.find({
            userId: req.user.id,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });
        
        const summary = {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            meals: {
                breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0 },
                lunch: { calories: 0, protein: 0, carbs: 0, fat: 0 },
                dinner: { calories: 0, protein: 0, carbs: 0, fat: 0 },
                snack: { calories: 0, protein: 0, carbs: 0, fat: 0 }
            }
        };
        
        meals.forEach(meal => {
            let mealCalories = 0;
            let mealProtein = 0;
            let mealCarbs = 0;
            let mealFat = 0;
            
            meal.items.forEach(item => {
                mealCalories += item.calories;
                mealProtein += item.protein;
                mealCarbs += item.carbs;
                mealFat += item.fat;
            });
            
            summary.meals[meal.category] = {
                calories: mealCalories,
                protein: mealProtein,
                carbs: mealCarbs,
                fat: mealFat
            };
            
            summary.totalCalories += mealCalories;
            summary.totalProtein += mealProtein;
            summary.totalCarbs += mealCarbs;
            summary.totalFat += mealFat;
        });
        
        res.json(summary);
    } catch (error) {
        console.error('Summary error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove food from meal
// @route   DELETE /api/meals/:mealId/items/:itemId
const removeFoodFromMeal = async (req, res) => {
    try {
        const meal = await Meal.findOne({
            _id: req.params.mealId,
            userId: req.user.id
        });
        
        if (!meal) {
            return res.status(404).json({ message: 'Meal not found' });
        }
        
        meal.items = meal.items.filter(
            item => item._id.toString() !== req.params.itemId
        );
        
        await meal.save();
        
        res.json({ message: 'Food removed' });
    } catch (error) {
        console.error('Remove food error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addFoodToMeal,
    getMealsByDate,
    getDailySummary,
    removeFoodFromMeal
};