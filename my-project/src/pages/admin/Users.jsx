import { useState, useEffect } from 'react';
import { Trash2, Search, User, Mail, Calendar, Shield, ShieldOff } from 'lucide-react';
import { fetchAPI } from '../../utils/api';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setMessage('');
            const result = await fetchAPI('/admin/users');

            if (result.success) {
                setUsers(result.data);
                setFilteredUsers(result.data);
            } else {
                setMessage('❌ Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage('❌ Error loading users');
        } finally {
            setLoading(false);
        }
    };

    const handlePromoteAdmin = async (userId) => {
        try {
            setActionLoading(userId);
            setMessage('');
            const result = await fetchAPI('/admin/make-admin', {
                method: 'POST',
                body: JSON.stringify({ userId })
            });

            if (result.success) {
                setMessage('✅ User promoted to admin');
                fetchUsers();
            } else {
                setMessage(`❌ ${result.error}`);
            }
        } catch (error) {
            console.error('Error promoting user:', error);
            setMessage('❌ Error promoting user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDemoteAdmin = async (userId) => {
        try {
            setActionLoading(userId);
            setMessage('');
            const result = await fetchAPI('/admin/remove-admin', {
                method: 'POST',
                body: JSON.stringify({ userId })
            });

            if (result.success) {
                setMessage('✅ Admin demoted to user');
                fetchUsers();
            } else {
                setMessage(`❌ ${result.error}`);
            }
        } catch (error) {
            console.error('Error demoting admin:', error);
            setMessage('❌ Error demoting admin');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            setActionLoading(userId);
            setMessage('');
            const result = await fetchAPI(`/admin/users/${userId}`, {
                method: 'DELETE'
            });

            if (result.success) {
                setMessage('✅ User deleted successfully');
                setUsers(users.filter(u => u._id !== userId));
                setDeleteConfirm(null);
                fetchUsers();
            } else {
                setMessage(`❌ ${result.error}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage('❌ Error deleting user');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return <div className="min-h-screen pt-24 flex items-center justify-center">Loading users...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-2">Manage and monitor user accounts</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-lg font-semibold text-blue-600">
                        Total Users: {users.length}
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg border ${
                        message.includes('✅')
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
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Join Date</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <User size={18} className="text-blue-600" />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <Mail size={16} />
                                                    <span>{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit ${
                                                    user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {user.role === 'admin' ? (
                                                        <>
                                                            <Shield size={14} />
                                                            <span>Admin</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <User size={14} />
                                                            <span>User</span>
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <Calendar size={16} />
                                                    <span>{new Date(user.date).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2">
                                                    {user.role === 'user' ? (
                                                        <button
                                                            onClick={() => handlePromoteAdmin(user._id)}
                                                            disabled={actionLoading === user._id}
                                                            className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors disabled:opacity-50"
                                                            title="Make admin"
                                                        >
                                                            <Shield size={18} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDemoteAdmin(user._id)}
                                                            disabled={actionLoading === user._id}
                                                            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors disabled:opacity-50"
                                                            title="Remove admin"
                                                        >
                                                            <ShieldOff size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setDeleteConfirm(user._id)}
                                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 px-6 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-xl">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this user? This action cannot be undone.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(deleteConfirm)}
                                    disabled={actionLoading === deleteConfirm}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {actionLoading === deleteConfirm ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
