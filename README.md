# Event Tracking System - Technical Assessment

A real-time user interaction tracking system built with the MERN stack (MongoDB, Express, React, Node.js) and an asynchronous queue system using Bull and Redis.

## Features
- **Real-time Event Capture**: Tracks clicks, mouse movements (throttled), and scrolling (throttled).
- **Asynchronous Processing**: Events are pushed to a Redis-backed queue to ensure high performance and zero lag for the user.
- **Background Worker**: A dedicated worker process consumes the queue and persists event data to MongoDB.
- **Live Event Feed**: A polished React dashboard displays the captured events in a table, fetching updates every 5 seconds.
- **Premium UI**: Built with Tailwind CSS and Lucide React icons for a modern, responsive feel.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Axios, Lucide React
- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Queue System**: Bull (Redis-backed)

## Setup Instructions

### Prerequisites
1.  **Node.js**: Ensure you have Node.js installed.
2.  **MongoDB**: A local instance of MongoDB running on `mongodb://127.0.0.1:27017/event_tracking`.
3.  **Redis**: A local Redis server running on `127.0.0.1:6379`. (Required for the Bull queue).

### 1. Clone the repository
```bash
git clone <repository-url>
cd Shopify_assignment
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (already included in this project):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/event_tracking
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 4. Run the Application
You can run both the frontend and backend concurrently using:
```bash
npm run dev
```
Alternatively, run them separately:
- **Backend**: `npm run server`
- **Frontend**: `npm run start`

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Explanation of Approach

### Event Capture
We track three main types of events: `click`, `scroll`, and `mousemove`. 
- **Clicks** are captured immediately.
- **Scroll** and **Mouse Movements** are throttled (1s and 2s respectively) to prevent overwhelming the server with frequent updates, while still capturing enough data to understand user behavior.

### Queue System
Instead of saving events directly to MongoDB (which could become a bottleneck under high traffic), the Express server acts as a **Producer**. It receives the event data and immediately pushes it into a **Bull Queue**. This allows the server to respond with a `202 Accepted` status almost instantly, providing a seamless experience.

### Worker Processing
A background worker (integrated within the server for this demo) listens to the `event-tracking` queue. When a new job arrives, it creates a new document in MongoDB. If the database is slow or briefly offline, Bull handles retries automatically with configurable backoff strategies.

### Data Storage
MongoDB stores the structured event data, including the event type, target element (for clicks), scroll position, coordinates, and timestamps.
