const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['click', 'scroll', 'mousemove']
    },
    element: {
        type: String,
        default: 'N/A'
    },
    x: Number,
    y: Number,
    scrollPosition: Number,
    timestamp: {
        type: Date,
        default: Date.now
    },
    path: String,
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

module.exports = mongoose.model('Event', eventSchema);
