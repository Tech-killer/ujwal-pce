import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Briefcase } from 'lucide-react';
import { fetchAPI } from '../utils/api';

export default function Feedback() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingProjects, setLoadingProjects] = useState(true);

    // Fetch projects when component mounts
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoadingProjects(true);
            const result = await fetchAPI('/projects');
            
            if (result.success) {
                setProjects(result.data);
            } else {
                setMessage('❌ Failed to load projects');
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            setMessage('❌ Failed to load projects');
        } finally {
            setLoadingProjects(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate project selection
        if (!selectedProject) {
            setMessage('Please select a project');
            return;
        }

        // Validate input
        if (!rating) {
            setMessage('Please select a rating');
            return;
        }

        if (!comments.trim()) {
            setMessage('Please enter your feedback comments');
            return;
        }

        if (comments.trim().length > 500) {
            setMessage('Comments must be 500 characters or less');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setMessage('Please login to submit feedback');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            // Get selected project details
            const project = projects.find(p => p._id === selectedProject);

            const result = await fetchAPI('/feedback', {
                method: 'POST',
                body: JSON.stringify({
                    projectId: project._id,
                    projectTitle: project.title,
                    projectLocation: project.state,
                    rating,
                    comments: comments.trim()
                })
            });

            if (result.success) {
                setMessage('✅ Feedback submitted successfully!');
                setSelectedProject('');
                setRating(0);
                setComments('');
                setTimeout(() => navigate('/Pages'), 2000);
            } else {
                setMessage(`❌ ${result.error || 'Error submitting feedback'}`);
            }
        } catch (err) {
            console.error('Error:', err);
            setMessage('❌ Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 pt-24 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2">Share Your Feedback</h2>
                    <p className="text-gray-600">Help us improve projects by sharing your experience and suggestions</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {message && (
                        <div className={`text-center mb-6 p-4 rounded-lg border ${
                            message.includes('✅') 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                            {message}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Project Selection */}
                        <div>
                            <label className="block text-lg font-semibold mb-3">Select Project</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <select
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    disabled={loading || loadingProjects}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                >
                                    <option value="">-- Choose a project --</option>
                                    {projects.map(project => (
                                        <option key={project._id} value={project._id}>
                                            {project.title} ({project.state})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Show selected project details */}
                            {selectedProject && projects.find(p => p._id === selectedProject) && (
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start space-x-3">
                                        <Briefcase className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-semibold text-blue-900">
                                                {projects.find(p => p._id === selectedProject)?.title}
                                            </p>
                                            <div className="flex items-center text-blue-700 text-sm mt-1">
                                                <MapPin size={16} className="mr-1" />
                                                {projects.find(p => p._id === selectedProject)?.state}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Rating Section */}
                        <div>
                            <label className="block text-lg font-semibold mb-4">How would you rate this project?</label>
                            <div className="flex space-x-3 justify-center md:justify-start">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        disabled={loading}
                                        className={`relative group transition-all ${
                                            rating >= star
                                                ? 'scale-110'
                                                : 'hover:scale-110'
                                        }`}
                                    >
                                        <Star
                                            size={48}
                                            fill={rating >= star ? '#FCD34D' : 'white'}
                                            className={`transition-all ${
                                                rating >= star
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300 hover:text-yellow-400'
                                            }`}
                                        />
                                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-8 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                            {star === 1 ? 'Poor' : star === 2 ? 'Fair' : star === 3 ? 'Good' : star === 4 ? 'Very Good' : 'Excellent'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-center mt-2 text-sm text-gray-600">
                                    Rating: <strong>{rating} / 5 stars</strong>
                                </p>
                            )}
                        </div>

                        {/* Comments Section */}
                        <div>
                            <label className="block text-lg font-semibold mb-3">Your Feedback</label>
                            <textarea
                                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                                rows="5"
                                placeholder="Tell us what you think about this project... (max 500 characters)"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                disabled={loading}
                                maxLength="500"
                            ></textarea>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-500">
                                    {comments.length} / 500 characters
                                </span>
                                {comments.length > 450 && (
                                    <span className="text-xs text-orange-600">Getting close to limit</span>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !selectedProject || !rating || !comments.trim() || loadingProjects}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Submitting...</span>
                                </div>
                            ) : (
                                'Submit Feedback'
                            )}
                        </button>
                    </form>

                    {/* Info Box */}
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                            <strong>📝 Note:</strong> Your feedback for this specific project helps authorities improve services. All feedback is public and visible in the project dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
