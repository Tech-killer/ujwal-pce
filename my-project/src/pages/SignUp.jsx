import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAPI } from '../utils/api';

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        
        // Validate inputs
        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            const result = await fetchAPI('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            });

            if (result.success) {
                setSuccess('Registration successful! Redirecting to login...');
                localStorage.setItem('token', result.data.token);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(result.error || 'Registration error. Please try again.');
            }
        } catch (err) {
            console.error('SignUp error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 z-[-1]">
                <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-[40%] right-[20%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
            <div className="w-full max-w-md p-8 rounded-2xl glass bg-white/40 dark:bg-black/40">
                <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
                {error && (
                    <div className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-green-600 text-center mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        {success}
                    </div>
                )}
                <form className="space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-white/50"
                            placeholder="John Doe"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-white/50"
                            placeholder="hello@example.com"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-white/50"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-600 mt-1">Min 6 characters</p>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}
