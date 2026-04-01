const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['weight', 'calorie', 'macro'],
        required: true
    },
    targetWeight: {
        type: Number,
        required: function() { return this.type === 'weight'; }
    },
    startWeight: {
        type: Number
    },
    dailyCalorieTarget: {
        type: Number,
        required: function() { return this.type === 'calorie'; }
    },
    proteinTarget: Number,
    carbsTarget: Number,
    fatTarget: Number,
    targetDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'achieved', 'abandoned'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Goal', goalSchema);