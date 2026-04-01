const mongoose = require('mongoose');

const mealEntrySchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0.1
    },
    servingUnit: {
        type: String,
        default: 'g'
    },
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
});

const mealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: () => new Date().setHours(0, 0, 0, 0)
    },
    category: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    },
    items: [mealEntrySchema],
    notes: {
        type: String,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
mealSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Meal', mealSchema);