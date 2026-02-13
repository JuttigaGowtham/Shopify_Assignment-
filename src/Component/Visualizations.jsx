import React, { useMemo } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

const COLORS = ['#6366f1', '#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

const Visualizations = ({ events }) => {
    // Process data for Pie Chart (Event Type Distribution)
    const typeData = useMemo(() => {
        if (!events.length) return [];
        const counts = events.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    }, [events]);

    // Process data for Area Chart (Activity over time)
    const timelineData = useMemo(() => {
        if (!events.length) return [];
        const intervals = {};
        // Use last 100 events to keep chart readable
        const recentEvents = events.slice(-100);
        recentEvents.forEach(event => {
            const date = new Date(event.timestamp);
            const timeStr = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
            intervals[timeStr] = (intervals[timeStr] || 0) + 1;
        });

        return Object.keys(intervals)
            .sort()
            .map(time => ({ time, count: intervals[time] }));
    }, [events]);

    // Process data for Bar Chart (Top Elements Clicked)
    const elementData = useMemo(() => {
        if (!events.length) return [];
        const counts = events
            .filter(e => e.type === 'click')
            .reduce((acc, event) => {
                const el = event.element || 'Unknown';
                acc[el] = (acc[el] || 0) + 1;
                return acc;
            }, {});

        return Object.keys(counts)
            .map(key => ({
                name: key.length > 20 ? key.substring(0, 17) + '...' : key,
                fullName: key,
                value: counts[key]
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [events]);

    const EmptyState = ({ title }) => (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"></div>
            </div>
            <p className="text-sm font-medium">Waiting for data...</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 w-full max-w-6xl mx-auto">
            {/* Pie Chart: Distribution */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                        Event Breakdown
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Distribution of captured interaction types.</p>
                </div>
                <div className="h-72">
                    {typeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={1500}
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <EmptyState />}
                </div>
            </div>

            {/* Area Chart: Activity Timeline */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                        Velocity Trend
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Frequency of events recorded over time.</p>
                </div>
                <div className="h-72">
                    {timelineData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timelineData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : <EmptyState />}
                </div>
            </div>

            {/* Bar Chart: Interactive Elements */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 md:col-span-2 transition-all hover:shadow-md">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                        Hotspots
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">The elements users are clicking on most frequently.</p>
                </div>
                <div className="h-72">
                    {elementData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={elementData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" axisLine={false} tickLine={false} hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    width={140}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                />
                                <Bar dataKey="value" fill="#f59e0b" radius={[0, 8, 8, 0]} barSize={32} animationDuration={1800} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <EmptyState />}
                </div>
            </div>
        </div>
    );
};

export default Visualizations;
