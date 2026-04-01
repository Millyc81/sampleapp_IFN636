const Meal = require('../models/Meal');
const Food = require('../models/Food');

// @desc    Get meals for a date
// @route   GET /api/meals?date=2024-01-15
const getMealsByDate = async (req, res) => {
    try {
        const date = new Date(req.query.date);
        date.setHours(0, 0, 0, 0);
        
        const meals = await Meal.find({
            userId: req.user.id,
            date: {
                $gte: date,
                $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
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
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add food to meal
// @route   POST /api/meals
const addFoodToMeal = async (req, res) => {
    try {
        const { date, category, foodId, quantity } = req.body;
        
        // Get food details
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        
        // Calculate nutrition based on quantity
        const multiplier = quantity / food.servingSize.amount;
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
            servingUnit: food.servingSize.unit,
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
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get daily nutrition summary
// @route   GET /api/meals/summary?date=2024-01-15
const getDailySummary = async (req, res) => {
    try {
        const date = new Date(req.query.date);
        date.setHours(0, 0, 0, 0);
        
        const meals = await Meal.find({
            userId: req.user.id,
            date: {
                $gte: date,
                $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
            }
        });
        
        const summary = {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            meals: {}
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
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMealsByDate,
    addFoodToMeal,
    removeFoodFromMeal,
    getDailySummary
};