import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { MousePointer2, MousePointerClick, Scroll, Table, RefreshCw, AlertCircle } from 'lucide-react';
import Footer from './Footer';
import Visualizations from './Visualizations';

const API_URL = 'http://localhost:5000/api/events';

function Home() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastEvent, setLastEvent] = useState(null);
    const scrollTimeoutRef = useRef(null);
    const mouseMoveTimeoutRef = useRef(null);

    // Fetch events from the database
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setEvents(response.data);
            setError(null);
        } catch (err) {
            setError('Could not connect to the backend server. Make sure it is running on port 5000.');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
        const interval = setInterval(fetchEvents, 5000); // Polling for updates
        return () => clearInterval(interval);
    }, [fetchEvents]);

    // Send event to the backend
    const sendEvent = async (eventData) => {
        try {
            await axios.post(API_URL, eventData);
            setLastEvent(eventData);
        } catch (err) {
            console.error('Error sending event:', err);
        }
    };

    // Event handlers
    useEffect(() => {
        const handleClick = (e) => {
            const eventData = {
                type: 'click',
                element: e.target.tagName + (e.target.id ? ` #${e.target.id}` : '') + (e.target.className ? ` .${e.target.className.split(' ')[0]}` : ''),
                x: e.clientX,
                y: e.clientY,
                path: window.location.pathname,
                timestamp: new Date()
            };
            sendEvent(eventData);
        };

        const handleScroll = () => {
            if (scrollTimeoutRef.current) return;

            scrollTimeoutRef.current = setTimeout(() => {
                const eventData = {
                    type: 'scroll',
                    scrollPosition: window.scrollY,
                    path: window.location.pathname,
                    timestamp: new Date()
                };
                sendEvent(eventData);
                scrollTimeoutRef.current = null;
            }, 1000); // Throttle scroll to once per second
        };

        const handleMouseMove = (e) => {
            if (mouseMoveTimeoutRef.current) return;

            mouseMoveTimeoutRef.current = setTimeout(() => {
                const eventData = {
                    type: 'mousemove',
                    x: e.clientX,
                    y: e.clientY,
                    path: window.location.pathname,
                    timestamp: new Date()
                };
                sendEvent(eventData);
                mouseMoveTimeoutRef.current = null;
            }, 2000); // Throttle mousemove to once every 2 seconds
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'click': return <MousePointerClick className="w-5 h-5 text-purple-500" />;
            case 'scroll': return <Scroll className="w-5 h-5 text-blue-500" />;
            case 'mousemove': return <MousePointer2 className="w-5 h-5 text-amber-500" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
            <header className="max-w-6xl mx-auto mb-12 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
                    Event <span className="text-indigo-600">Tracker</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Capturing real-time user interactions using a Bull-powered background queue.
                </p>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Interaction Tracker Status */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-500' : 'text-slate-400'}`} />
                            Live Status
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-medium text-slate-500">Last Event</span>
                                <span className="text-sm font-bold text-slate-700 capitalize">
                                    {lastEvent ? lastEvent.type : 'None'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-medium text-slate-500">Total Recorded</span>
                                <span className="text-sm font-bold text-slate-700">{events.length}</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">How it works</h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex gap-2">
                                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                                    Listen for browser events (clicks, scrolls, moves)
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                                    Push to Redis queue via Node.js producer
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                                    Background worker processes and saves to MongoDB
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl text-white shadow-lg">
                        <h2 className="text-xl font-bold mb-2">Interact to track!</h2>
                        <p className="text-indigo-100 text-sm mb-4">Click anywhere, scroll the page, or just move your mouse to see events appear in the queue.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                id="test-btn-1"
                                className="bg-white/20 hover:bg-white/30 transition-colors py-2 px-4 rounded-lg text-sm font-medium backdrop-blur-sm border border-white/10"
                            >
                                Button A
                            </button>
                            <button
                                id="test-btn-2"
                                className="bg-white/20 hover:bg-white/30 transition-colors py-2 px-4 rounded-lg text-sm font-medium backdrop-blur-sm border border-white/10"
                            >
                                Button B
                            </button>
                        </div>
                    </div>
                </div>

                {/* Events Table */}
                <div className="lg:col-span-2">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-700 items-center">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Table className="w-5 h-5 text-indigo-600" />
                                Event Log
                            </h2>
                            <button
                                onClick={fetchEvents}
                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                                title="Refresh logs"
                            >
                                <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-white shadow-sm z-10">
                                    <tr className="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-3">Event</th>
                                        <th className="px-6 py-3">Element/Details</th>
                                        <th className="px-6 py-3">Position</th>
                                        <th className="px-6 py-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {events.length > 0 ? (
                                        events.map((event, idx) => (
                                            <tr key={event._id || idx} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                                            {getEventIcon(event.type)}
                                                        </div>
                                                        <span className="font-semibold text-slate-700 capitalize">{event.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-500 font-mono">
                                                        {event.type === 'scroll' ? `Scroll Pos: ${event.scrollPosition}px` : (event.element || 'N/A')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {event.x !== undefined ? `${event.x}, ${event.y}` : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-400">
                                                    {formatDate(event.timestamp)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                                {loading ? 'Fetching events...' : 'No events captured yet. interact with the page!'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Visualizations Section */}
            <section className="mt-12 mb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Interaction Analytics</h2>
                        <p className="text-slate-600">Visual mapping of user behavior and engagement patterns.</p>
                    </div>
                    <Visualizations events={events} />
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;
