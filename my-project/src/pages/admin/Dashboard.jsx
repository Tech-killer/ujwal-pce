import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalFeedback: 0,
        averageRating: 0,
        activeIssues: 0,
    });
    const [feedbackData, setFeedbackData] = useState([]);
    const [ratingDistribution, setRatingDistribution] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fetch all feedback
            const feedbackRes = await fetch('https://ujwal-pce.onrender.com/api/feedback', {
                headers: {
                    'x-auth-token': token
                }
            });
            const feedbackList = await feedbackRes.json();

            // Calculate stats
            if (Array.isArray(feedbackList) && feedbackList.length > 0) {
                const avgRating = (feedbackList.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackList.length).toFixed(1);

                // Calculate rating distribution
                const distribution = [
                    { name: '⭐ 5 Stars', value: feedbackList.filter(f => f.rating === 5).length, color: '#10B981' },
                    { name: '⭐ 4 Stars', value: feedbackList.filter(f => f.rating === 4).length, color: '#3B82F6' },
                    { name: '⭐ 3 Stars', value: feedbackList.filter(f => f.rating === 3).length, color: '#F59E0B' },
                    { name: '⭐ 2 Stars', value: feedbackList.filter(f => f.rating === 2).length, color: '#EF4444' },
                    { name: '⭐ 1 Star', value: feedbackList.filter(f => f.rating === 1).length, color: '#DC2626' },
                ];

                setStats({
                    totalUsers: 25, // Mock - would come from users API in future
                    totalFeedback: feedbackList.length,
                    averageRating: avgRating,
                    activeIssues: feedbackList.filter(f => f.rating <= 2).length,
                });
                setRatingDistribution(distribution);
                setFeedbackData(feedbackList.slice(0, 6).reverse());
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'text-blue-600', bg: 'bg-blue-50' },
        { icon: MessageSquare, label: 'Total Feedback', value: stats.totalFeedback, color: 'text-green-600', bg: 'bg-green-50' },
        { icon: TrendingUp, label: 'Avg Rating', value: `${stats.averageRating}/5`, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { icon: AlertCircle, label: 'Low Ratings', value: stats.activeIssues, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    if (loading) {
        return <div className="min-h-screen pt-24 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-4 rounded-lg ${stat.bg}`}>
                                    <stat.icon size={24} className={stat.color} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Rating Distribution */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Rating Distribution</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={ratingDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {ratingDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value} feedback`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            {ratingDistribution.map((item, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Feedback Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-gray-600">Total Feedback</span>
                                <span className="text-2xl font-bold">{stats.totalFeedback}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-gray-600">Average Rating</span>
                                <span className="text-2xl font-bold">{stats.averageRating}⭐</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-gray-600">5-Star Ratings</span>
                                <span className="text-2xl font-bold">{ratingDistribution[0]?.value || 0}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4">
                                <span className="text-gray-600">Low Ratings (&lt;3)</span>
                                <span className="text-2xl font-bold text-red-600">{stats.activeIssues}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Feedback */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Feedback</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Rating</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Comments</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbackData.map((feedback, i) => (
                                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">{feedback.user?.name || 'Unknown'}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                                                {feedback.rating}⭐
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{feedback.comments}</td>
                                        <td className="py-3 px-4 text-gray-500 text-xs">
                                            {new Date(feedback.date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
