const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('../models/Food');

dotenv.config();

const foods = [
    // Fruits
    { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: 'fruits' },
    { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, category: 'fruits' },
    { name: 'Orange', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, category: 'fruits' },
    { name: 'Strawberries', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, category: 'fruits' },
    { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, category: 'fruits' },
    { name: 'Grapes', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, category: 'fruits' },
    { name: 'Watermelon', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, category: 'fruits' },
    { name: 'Pineapple', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, category: 'fruits' },
    { name: 'Mango', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, category: 'fruits' },
    
    // Vegetables
    { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, category: 'vegetables' },
    { name: 'Carrot', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, category: 'vegetables' },
    { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: 'vegetables' },
    { name: 'Tomato', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, category: 'vegetables' },
    { name: 'Cucumber', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, category: 'vegetables' },
    { name: 'Bell Pepper', calories: 31, protein: 1.3, carbs: 6, fat: 0.3, category: 'vegetables' },
    { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, category: 'vegetables' },
    { name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, category: 'vegetables' },
    
    // Meats & Proteins
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'meats' },
    { name: 'Chicken Thigh', calories: 209, protein: 26, carbs: 0, fat: 10.9, category: 'meats' },
    { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, category: 'meats' },
    { name: 'Tuna', calories: 116, protein: 25, carbs: 0, fat: 1, category: 'meats' },
    { name: 'Lean Beef', calories: 250, protein: 26, carbs: 0, fat: 15, category: 'meats' },
    { name: 'Egg', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, category: 'meats' },
    { name: 'Tofu', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, category: 'meats' },
    { name: 'Lentils', calories: 116, protein: 9, carbs: 20, fat: 0.4, category: 'meats' },
    
    // Grains
    { name: 'Oatmeal', calories: 68, protein: 2.4, carbs: 12, fat: 1.4, category: 'grains' },
    { name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, category: 'grains' },
    { name: 'White Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: 'grains' },
    { name: 'Quinoa', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, category: 'grains' },
    { name: 'Whole Wheat Bread', calories: 265, protein: 13, carbs: 49, fat: 3.2, category: 'grains' },
    { name: 'Pasta', calories: 131, protein: 5, carbs: 25, fat: 0.8, category: 'grains' },
    
    // Dairy
    { name: 'Milk (2%)', calories: 50, protein: 3.3, carbs: 4.8, fat: 1.9, category: 'dairy' },
    { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, category: 'dairy' },
    { name: 'Plain Yogurt', calories: 59, protein: 5, carbs: 4.7, fat: 3.3, category: 'dairy' },
    { name: 'Cheddar Cheese', calories: 404, protein: 25, carbs: 1.3, fat: 33, category: 'dairy' },
    { name: 'Mozzarella', calories: 280, protein: 28, carbs: 3, fat: 17, category: 'dairy' },
    
    // Snacks
    { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 49, category: 'snacks' },
    { name: 'Walnuts', calories: 654, protein: 15, carbs: 14, fat: 65, category: 'snacks' },
    { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fat: 50, category: 'snacks' },
    { name: 'Dark Chocolate', calories: 546, protein: 7, carbs: 46, fat: 38, category: 'snacks' },
    { name: 'Potato Chips', calories: 536, protein: 7, carbs: 53, fat: 34, category: 'snacks' }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        // Clear existing foods
        const deleted = await Food.deleteMany({});
        console.log(`🗑️ Deleted ${deleted.deletedCount} existing foods`);
        
        // Insert new foods
        const inserted = await Food.insertMany(foods);
        console.log(`✅ Added ${inserted.length} foods to database`);
        
        // List all foods added
        console.log('\n📋 Foods added:');
        inserted.forEach(f => console.log(`   - ${f.name} (${f.category})`));
        
        console.log('\n🎉 Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();