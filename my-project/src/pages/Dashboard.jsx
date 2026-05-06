import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Filter, Star, AlertCircle, Users, TrendingUp, Calendar, ChevronDown, Activity, Trash2 } from 'lucide-react';

export default function Dashboard() {
    // Mock Data for Charts
    const trendData = [
        { name: 'Jan', value: 200 },
        { name: 'Feb', value: 350 },
        { name: 'Mar', value: 280 },
        { name: 'Apr', value: 500 },
        { name: 'May', value: 420 },
        { name: 'Jun', value: 600 },
    ];

    const sectorData = [
        { name: 'Road', value: 45, color: '#3B82F6' },
        { name: 'Railway', value: 25, color: '#8B5CF6' },
        { name: 'Metro', value: 18, color: '#EC4899' },
        { name: 'Port', value: 12, color: '#10B981' },
    ];

    const issuesData = [
        { name: 'Delays', count: 156, percent: 38, width: '38%' },
        { name: 'Safety Concerns', count: 89, percent: 22, width: '22%' },
        { name: 'Environmental', count: 67, percent: 16, width: '16%' },
        { name: 'Quality Issues', count: 54, percent: 13, width: '13%' },
        { name: 'Other', count: 46, percent: 11, width: '11%' },
    ];

    const stats = [
        { title: 'Avg Score', value: '3.9', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { title: 'Active Issues', value: '8', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
        { title: 'Active Users', value: '24', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'This Month', value: '2,019', icon: Activity, color: 'text-green-500', bg: 'bg-green-50' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Feedback Dashboard</h1>
                        <p className="text-gray-600 mt-2">Aggregated insights from citizen feedback across all projects</p>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:border-blue-500 transition-colors shadow-sm">
                            <span>All States</span>
                            <ChevronDown size={14} />
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:border-blue-500 transition-colors shadow-sm">
                            <span>All Sectors</span>
                            <ChevronDown size={14} />
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:border-blue-500 transition-colors shadow-sm">
                            <span>Status</span>
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-500">{stat.title}</div>
                            </div>
                            <div className={`p-4 rounded-full ${stat.bg}`}>
                                <stat.icon size={24} className={stat.color} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Feedback Trend Chart */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Feedback Trend</h3>
                            <div className="p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                <Calendar size={18} className="text-gray-500" />
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Feedback By Sector Chart */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Feedback by Sector</h3>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-full h-[300px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sectorData}
                                            innerRadius={80}
                                            outerRadius={110}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {sectorData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Text Overlay */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-bold text-gray-900">100%</span>
                                    <span className="text-gray-500 text-sm">Distribution</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 mt-4">
                            {sectorData.map((item, i) => (
                                <div key={i} className="flex items-center text-sm text-gray-600">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                    {item.name} ({item.value}%)
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Reported Issues */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Top Reported Issues</h3>
                    <div className="space-y-6">
                        {issuesData.map((issue, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center font-medium text-gray-700">
                                        <span className="w-32">{issue.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <span className="text-sm font-semibold text-gray-900">{issue.count}</span>
                                        <span className="text-sm text-gray-500 w-8 text-right">{issue.percent}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="h-2.5 rounded-full bg-blue-600"
                                        style={{ width: issue.width, opacity: Math.max(0.3, 1 - i * 0.15) }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
