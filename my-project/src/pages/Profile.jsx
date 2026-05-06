import { useState, useEffect } from 'react';
import { Mail, Calendar, CheckCircle, Star, Briefcase, MapPin, Trash2 } from 'lucide-react';
import { fetchAPI } from '../utils/api';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                
                const result = await fetchAPI('/auth');
                
                if (result.success) {
                    setUser(result.data);
                    
                    // Fetch user's feedback AFTER user data is loaded
                    if (result.data && result.data._id) {
                        await fetchUserFeedback(result.data._id);
                    }
                } else {
                    throw new Error(result.error || 'Failed to fetch user profile');
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                setError(err.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const fetchUserFeedback = async (userId) => {
        try {
            setFeedbackLoading(true);
            const result = await fetchAPI('/feedback');
            
            if (result.success) {
                const data = result.data;
                
                // Temporarily show ALL feedback for debugging
                // Filter only for user once we confirm it's working
                setFeedbacks(Array.isArray(data) 
                    ? data.sort((a, b) => new Date(b.date) - new Date(a.date))
                    : []
                );
            }
        } catch (err) {
            console.error('Error fetching feedback:', err);
        } finally {
            setFeedbackLoading(false);
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'bg-green-100 text-green-700';
        if (rating === 3) return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p className="text-lg">Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center text-gray-600">
                    <p className="text-lg">No user data found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 pt-24 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="text-center mb-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mb-6 flex items-center justify-center text-5xl text-white font-bold mx-auto shadow-lg">
                        {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                    <p className="text-gray-500 flex items-center justify-center space-x-1">
                        <Mail size={16} />
                        <span>{user.email}</span>
                    </p>
                </div>

                {/* Profile Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3 mb-2">
                            <CheckCircle size={20} className="text-green-600" />
                            <span className="text-gray-600 text-sm font-medium">Status</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">Active</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3 mb-2">
                            <Calendar size={20} className="text-blue-600" />
                            <span className="text-gray-600 text-sm font-medium">Member Since</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {user.date ? new Date(user.date).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Feedback History */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold mb-6">Your Feedback History</h3>
                    <p className="text-xs text-gray-500 mb-4">Current User ID: {user?._id}</p>
                    
                    {feedbackLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                            <p className="text-gray-600 mt-3">Loading feedback...</p>
                        </div>
                    ) : feedbacks && feedbacks.length > 0 ? (
                        <div className="space-y-4">
                            {feedbacks.map((feedback) => (
                                <div key={feedback._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    {/* Debug Info */}
                                    <p className="text-xs text-gray-400 mb-2">Feedback User ID: {typeof feedback.user === 'object' ? feedback.user._id : feedback.user}</p>
                                    
                                    {/* Project Info */}
                                    <div className="flex items-start space-x-3 mb-3 p-3 bg-blue-50 rounded-lg">
                                        <Briefcase className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-blue-900">{feedback.projectTitle}</p>
                                            <div className="flex items-center text-blue-700 text-sm mt-1">
                                                <MapPin size={14} className="mr-1 flex-shrink-0" />
                                                <span className="truncate">{feedback.projectLocation || 'Unknown Location'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center space-x-3 mb-3">
                                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${getRatingColor(feedback.rating)}`}>
                                            <Star size={14} fill="currentColor" />
                                            <span>{feedback.rating}/5</span>
                                        </span>
                                    </div>

                                    {/* Comments */}
                                    <p className="text-gray-700 mb-2">{feedback.comments}</p>

                                    {/* Date */}
                                    <p className="text-xs text-gray-500">
                                        {new Date(feedback.date).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No feedback submitted yet</p>
                            <p className="text-sm mt-2">Start by visiting the Feedback page to submit your feedback</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
