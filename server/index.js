const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const eventQueue = require('./queue/eventQueue');
const Event = require('./models/Event');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Route to receive events
app.post('/api/events', async (req, res) => {
    try {
        const eventData = req.body;
        // Add to queue instead of saving directly
        await eventQueue.add(eventData, {
            attempts: 3,
            backoff: 5000
        });
        res.status(202).json({ message: 'Event queued for processing' });
    } catch (error) {
        console.error('Error queuing event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to fetch all saved events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ timestamp: -1 }).limit(100);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
