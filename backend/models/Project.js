const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: String,
        required: true,
        enum: ['New York', 'Georgia', 'Florida', 'Illinois', 'Michigan', 'North Carolina', 'California', 'Pennsylvania']
    },
    sector: {
        type: String,
        required: true,
        enum: ['Renovation', 'Construction', 'Other', 'Innovation', 'Maintenance', 'Infrastructure']
    },
    status: {
        type: String,
        required: true,
        enum: ['On Track', 'On hold', 'Behind', 'Completed']
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedbackCount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
