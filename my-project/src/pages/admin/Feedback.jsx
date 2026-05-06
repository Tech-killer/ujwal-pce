import { useState, useEffect } from 'react';
import { Trash2, Search, Eye, MessageSquare, Star, Briefcase, MapPin } from 'lucide-react';

export default function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedback, setFilteredFeedback] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('All');
    const [projectFilter, setProjectFilter] = useState('All');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        // Load projects from backend
        fetchProjects();
        fetchFeedback();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/projects');
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        let filtered = feedbacks;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(f =>
                f.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                f.comments?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                f.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Rating filter
        if (ratingFilter !== 'All') {
            const rating = parseInt(ratingFilter);
            filtered = filtered.filter(f => f.rating === rating);
        }

        // Project filter
        if (projectFilter !== 'All') {
            filtered = filtered.filter(f => f.projectId === projectFilter || f.projectId._id === projectFilter);
        }

        setFilteredFeedback(filtered);
    }, [searchTerm, ratingFilter, projectFilter, feedbacks]);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/feedback', {
                headers: {
                    'x-auth-token': token
                }
            });
            const data = await response.json();
            setFeedbacks(Array.isArray(data) ? data.sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            ) : []);
            setFilteredFeedback(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/feedback/${feedbackId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });

            if (response.ok) {
                setFeedbacks(feedbacks.filter(f => f._id !== feedbackId));
                setDeleteConfirm(null);
                // Refresh projects to get updated feedback count
                fetchProjects();
            } else {
                console.error('Error deleting feedback');
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'bg-green-100 text-green-700';
        if (rating === 3) return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    if (loading) {
        return <div className="min-h-screen pt-24 flex items-center justify-center">Loading feedback...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
                        <p className="text-gray-600 mt-2">View, analyze, and manage all user feedback by project</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-lg font-semibold text-blue-600">
                        Total Feedback: {feedbacks.length}
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by user, project, or comments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Star className="absolute left-4 top-3 text-gray-400" size={20} />
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="All">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>

                    <div className="relative">
                        <Briefcase className="absolute left-4 top-3 text-gray-400" size={20} />
                        <select
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="All">All Projects</option>
                            {projects.map(project => (
                                <option key={project._id} value={project._id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="space-y-4">
                    {filteredFeedback.length > 0 ? (
                        filteredFeedback.map((feedback) => (
                            <div key={feedback._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1">
                                        {/* Project Info */}
                                        <div className="flex items-start space-x-3 mb-4 p-3 bg-blue-50 rounded-lg">
                                            <Briefcase className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-blue-900 truncate">{feedback.projectTitle}</p>
                                                <div className="flex items-center text-blue-700 text-sm mt-1">
                                                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                                                    <span className="truncate">{feedback.projectLocation || 'Unknown Location'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* User Info */}
                                        <div className="flex items-start space-x-3 mb-4 p-3 bg-purple-50 rounded-lg">
                                            <MessageSquare className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-purple-900">{feedback.user?.name || 'Anonymous'}</p>
                                                <p className="text-purple-700 text-sm">{feedback.user?.email || 'N/A'}</p>
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
                                        <p className="text-gray-700 mb-2 max-w-2xl line-clamp-2">
                                            {feedback.comments}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {new Date(feedback.date).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex space-x-2 mt-4 md:mt-0 flex-shrink-0">
                                        <button
                                            onClick={() => setSelectedFeedback(feedback)}
                                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            title="View details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(feedback._id)}
                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                            title="Delete feedback"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                            <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">No feedback found</p>
                        </div>
                    )}
                </div>

                {/* View Details Modal */}
                {selectedFeedback && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Feedback Details</h3>

                            <div className="space-y-4 mb-6">
                                {/* Project Info */}
                                <div className="border-b pb-4 p-4 bg-blue-50 rounded-lg">
                                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Project</h4>
                                    <p className="text-lg font-semibold text-blue-900">{selectedFeedback.projectTitle}</p>
                                    <div className="flex items-center text-blue-700 text-sm mt-2">
                                        <MapPin size={16} className="mr-1" />
                                        {selectedFeedback.projectLocation || 'Unknown Location'}
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="border-b pb-4 p-4 bg-purple-50 rounded-lg">
                                    <h4 className="text-sm font-semibold text-purple-900 mb-2">User</h4>
                                    <p className="text-lg font-semibold text-purple-900">{selectedFeedback.user?.name || 'Anonymous'}</p>
                                    <p className="text-purple-700 text-sm">{selectedFeedback.user?.email || 'N/A'}</p>
                                </div>

                                <div className="border-b pb-4">
                                    <label className="text-sm font-semibold text-gray-600">Rating</label>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${getRatingColor(selectedFeedback.rating)}`}>
                                            <Star size={16} fill="currentColor" />
                                            <span>{selectedFeedback.rating} / 5</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="border-b pb-4">
                                    <label className="text-sm font-semibold text-gray-600">Feedback</label>
                                    <p className="text-gray-700 mt-2">{selectedFeedback.comments}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Submitted On</label>
                                    <p className="text-gray-900">{new Date(selectedFeedback.date).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setSelectedFeedback(null)}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setDeleteConfirm(selectedFeedback._id);
                                        setSelectedFeedback(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-xl">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Feedback?</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this feedback? This action cannot be undone.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteFeedback(deleteConfirm)}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
