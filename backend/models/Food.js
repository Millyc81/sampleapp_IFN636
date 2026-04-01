const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a food name'],
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    calories: {
        type: Number,
        required: [true, 'Please add calories'],
        min: 0
    },
    protein: {
        type: Number,
        default: 0,
        min: 0
    },
    carbs: {
        type: Number,
        default: 0,
        min: 0
    },
    fat: {
        type: Number,
        default: 0,
        min: 0
    },
    fiber: {
        type: Number,
        default: 0
    },
    sugar: {
        type: Number,
        default: 0
    },
    servingSize: {
        amount: { type: Number, default: 100 },
        unit: { type: String, default: 'g' }
    },
    barcode: {
        type: String,
        sparse: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['fruits', 'vegetables', 'meats', 'dairy', 'grains', 'snacks', 'beverages', 'other'],
        default: 'other'
    },
    isCustom: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Food', foodSchema);