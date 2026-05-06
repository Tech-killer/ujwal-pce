import { useState, useEffect } from 'react';
import { Search, MapPin, Star, MessageSquare, X, RefreshCw } from 'lucide-react';
import { fetchAPI } from '../utils/api';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('All');
    const [selectedSector, setSelectedSector] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectFeedback, setProjectFeedback] = useState([]);
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    const states = ['All', 'New York', 'Georgia', 'Florida', 'Illinois', 'Michigan', 'North Carolina', 'California', 'Pennsylvania'];
    const sectors = ['All', 'Renovation', 'Construction', 'Other', 'Innovation', 'Maintenance', 'Infrastructure'];
    const statuses = ['All', 'On Track', 'On hold', 'Behind', 'Completed'];

    useEffect(() => {
        fetchProjects();
        
        // Refresh projects when page comes into focus
        const handleFocus = () => {
            console.log('📄 Projects page focused, refreshing...');
            fetchProjects();
        };
        
        window.addEventListener('focus', handleFocus);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    useEffect(() => {
        filterProjects();
    }, [projects, searchTerm, selectedState, selectedSector, selectedStatus]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const result = await fetchAPI('/projects');
            
            if (result.success) {
                setProjects(result.data);
            } else {
                console.error('Failed to fetch projects:', result.error);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterProjects = () => {
        let filtered = projects;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.state?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // State filter
        if (selectedState !== 'All') {
            filtered = filtered.filter(p => p.state === selectedState);
        }

        // Sector filter
        if (selectedSector !== 'All') {
            filtered = filtered.filter(p => p.sector === selectedSector);
        }

        // Status filter
        if (selectedStatus !== 'All') {
            filtered = filtered.filter(p => p.status === selectedStatus);
        }

        setFilteredProjects(filtered);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'On Track': return 'bg-blue-100 text-blue-700';
            case 'Behind': return 'bg-red-100 text-red-700';
            case 'On hold': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const fetchProjectFeedback = async (projectId) => {
        try {
            setFeedbackLoading(true);
            const result = await fetchAPI('/feedback');
            
            if (result.success) {
                const allFeedback = result.data;
                // Filter feedback for this specific project (handle both string and object projectId)
                const filtered = allFeedback.filter(f => 
                    f.projectId === projectId || 
                    (typeof f.projectId === 'object' && f.projectId._id === projectId) ||
                    (typeof f.projectId === 'object' && f.projectId === projectId)
                );
                setProjectFeedback(filtered);
            } else {
                console.error('Failed to fetch feedback:', result.error);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setFeedbackLoading(false);
        }
    };

    const handleViewFeedback = (project) => {
        setSelectedProject(project);
        fetchProjectFeedback(project._id);
    };

    const closeFeedbackModal = () => {
        setSelectedProject(null);
        setProjectFeedback([]);
        // Refresh projects to get updated feedback count
        fetchProjects();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <h1 className="text-4xl font-bold text-gray-900">Project Directory</h1>
                        <button
                            onClick={fetchProjects}
                            disabled={loading}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                            title="Refresh project data"
                        >
                            <RefreshCw size={24} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <p className="text-lg text-gray-600">Browse and explore public infrastructure projects across India</p>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects by name or state..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* State Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Sector Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                            <select
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Projects Count */}
                <div className="mb-6 text-gray-600">
                    <p>Showing <span className="font-semibold text-gray-900">{filteredProjects.length}</span> projects</p>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 mt-4">Loading projects...</p>
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow p-6">
                                {/* Status Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                    <span className="text-lg font-bold text-gray-900">{project.rating}⭐</span>
                                </div>

                                {/* Project Title */}
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {project.title}
                                </h3>

                                {/* Location */}
                                <div className="flex items-center text-gray-600 mb-3">
                                    <MapPin size={16} className="mr-1 flex-shrink-0" />
                                    <span className="text-sm">{project.state}</span>
                                </div>

                                {/* Sector Badge */}
                                <div className="mb-4">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                                        {project.sector}
                                    </span>
                                </div>

                                {/* Description */}
                                {project.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {project.description}
                                    </p>
                                )}

                                {/* Feedback Count */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <MessageSquare size={16} className="mr-1" />
                                        <span>{project.feedbackCount} feedback</span>
                                    </div>
                                    <button 
                                        onClick={() => handleViewFeedback(project)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        View Feedback
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-lg">No projects found matching your filters</p>
                    </div>
                )}
            </div>

            {/* Feedback Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                                <p className="text-gray-600 text-sm mt-1">{selectedProject.state} • {selectedProject.sector}</p>
                            </div>
                            <button
                                onClick={closeFeedbackModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {feedbackLoading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="text-gray-600 mt-3">Loading feedback...</p>
                                </div>
                            ) : projectFeedback.length > 0 ? (
                                <div className="space-y-4">
                                    {projectFeedback.map((feedback) => (
                                        <div key={feedback._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                            {/* User Info */}
                                            {feedback.user && (
                                                <div className="flex items-center mb-3 pb-3 border-b border-gray-100">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                                        <span className="text-purple-700 font-semibold text-sm">
                                                            {feedback.user.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{feedback.user.name}</p>
                                                        <p className="text-xs text-gray-500">{feedback.user.email}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Rating */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-lg font-bold text-yellow-500">{feedback.rating}⭐</span>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(feedback.date).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {/* Comments */}
                                            <p className="text-gray-700 text-sm">{feedback.comments}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <MessageSquare size={32} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500">No feedback yet for this project</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
