const Queue = require('better-queue');
const Event = require('../models/Event');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Initialize better-queue
// It's an in-memory queue by default, which is perfect for this assessment 
// as it doesn't require an external Redis server but still provides 
// true async background processing.
const eventQueue = new Queue(async (eventData, cb) => {
    console.log(`Processing event: ${eventData.type}`);
    try {
        const newEvent = new Event(eventData);
        await newEvent.save();
        console.log(`Event saved to database: ${eventData.type}`);
        cb(null, { status: 'success' });
    } catch (error) {
        console.error(`Error processing event:`, error);
        cb(error);
    }
}, {
    concurrent: 1, // Process one at a time to ensure order
    maxRetries: 3,
    retryDelay: 1000
});

module.exports = {
    add: (data) => {
        return new Promise((resolve, reject) => {
            eventQueue.push(data, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
};
