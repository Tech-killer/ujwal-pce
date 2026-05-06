import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import { fetchAPI } from '../../utils/api';

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        state: 'New York',
        sector: 'Construction',
        status: 'On Track',
        rating: 3,
        feedbackCount: 0,
        description: ''
    });

    const states = ['New York', 'Georgia', 'Florida', 'Illinois', 'Michigan', 'North Carolina', 'California', 'Pennsylvania'];
    const sectors = ['Renovation', 'Construction', 'Other', 'Innovation', 'Maintenance', 'Infrastructure'];
    const statuses = ['On Track', 'On hold', 'Behind', 'Completed'];

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        const filtered = projects.filter(p =>
            p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.state?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [searchTerm, projects]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setMessage('');
            const result = await fetchAPI('/projects');

            if (result.success) {
                setProjects(result.data);
                setFilteredProjects(result.data);
            } else {
                setMessage('❌ Failed to fetch projects');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setMessage('❌ Error loading projects');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' || name === 'feedbackCount' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setMessage('❌ Project title is required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const method = editingProject ? 'PUT' : 'POST';
            const url = editingProject
                ? `https://ujwal-pce.onrender.com/api/projects/${editingProject._id}`
                : 'https://ujwal-pce.onrender.com/api/projects';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage(`✅ Project ${editingProject ? 'updated' : 'created'} successfully`);
                setFormData({
                    title: '',
                    state: 'New York',
                    sector: 'Construction',
                    status: 'On Track',
                    rating: 3,
                    feedbackCount: 0,
                    description: ''
                });
                setEditingProject(null);
                setShowForm(false);
                fetchProjects();
            } else {
                const error = await response.json();
                setMessage(`❌ ${error.msg}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('❌ Error saving project');
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData(project);
        setShowForm(true);
    };

    const handleDelete = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://ujwal-pce.onrender.com/api/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });

            if (response.ok) {
                setMessage('✅ Project deleted successfully');
                setDeleteConfirm(null);
                fetchProjects();
            } else {
                const error = await response.json();
                setMessage(`❌ ${error.msg}`);
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            setMessage('❌ Error deleting project');
        }
    };

    if (loading) {
        return <div className="min-h-screen pt-24 flex items-center justify-center">Loading projects...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
                        <p className="text-gray-600 mt-2">Create, edit, and manage public infrastructure projects</p>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditingProject(null);
                            setFormData({
                                title: '',
                                state: 'New York',
                                sector: 'Construction',
                                status: 'On Track',
                                rating: 3,
                                feedbackCount: 0,
                                description: ''
                            });
                        }}
                        className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>New Project</span>
                    </button>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg border ${message.includes('✅')
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {message}
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by project name or state..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Projects Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Project</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">State</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Sector</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Rating</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Feedback</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map((project) => (
                                        <tr key={project._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 font-medium text-gray-900">{project.title}</td>
                                            <td className="py-4 px-6 text-gray-600">{project.state}</td>
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                                    {project.sector}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    project.status === 'On Track' ? 'bg-blue-100 text-blue-700' :
                                                        project.status === 'Behind' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-semibold">{project.rating}⭐</td>
                                            <td className="py-4 px-6 text-gray-600">{project.feedbackCount}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(project)}
                                                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(project._id)}
                                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 px-6 text-center text-gray-500">
                                            No projects found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Project Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                {editingProject ? 'Edit Project' : 'Create New Project'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Project Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Project title"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">State *</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Sector *</label>
                                    <select
                                        name="sector"
                                        value={formData.sector}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Status *</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Rating (1-5) *</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        min="1"
                                        max="5"
                                        step="0.1"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Feedback Count</label>
                                    <input
                                        type="number"
                                        name="feedbackCount"
                                        min="0"
                                        value={formData.feedbackCount}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Project description"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                    >
                                        {editingProject ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-xl">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Project?</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this project? This action cannot be undone.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
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
