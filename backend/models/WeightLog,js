const mongoose = require('mongoose');

const weightLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight: {
        type: Number,
        required: true,
        min: 20,
        max: 500
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        maxlength: 200
    }
});

// Ensure one weight entry per day
weightLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('WeightLog', weightLogSchema);