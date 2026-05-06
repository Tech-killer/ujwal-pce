import { Link, useLocation } from 'react-router-dom';
import { Home, Folder, LayoutDashboard, Info, User, MessageSquare, LogOut, LogIn, Settings } from 'lucide-react';

export default function Navbar({ isAuthenticated, isAdmin, onLogout }) {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${isActive(to)
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </Link>
    );

    return (
        <nav className="fixed top-0 left-0 w-full z-50 glass bg-white/70 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            PublicPulse
                        </Link>
                        {isAdmin && (
                            <span className="ml-3 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                ADMIN
                            </span>
                        )}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {!isAuthenticated ? (
                            <>
                                <NavItem to="/" icon={Home} label="Home" />
                                <NavItem to="/projects" icon={Folder} label="Projects" />
                                <NavItem to="/Pages" icon={LayoutDashboard} label="Dashboard" />
                                <NavItem to="/about" icon={Info} label="About" />
                                <span className="h-6 w-px bg-gray-200 mx-2"></span>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 transition-opacity font-medium text-sm flex items-center space-x-2"
                                >
                                    <LogIn size={16} />
                                    <span>Login</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                {isAdmin ? (
                                    <>
                                        <NavItem to="/admin" icon={Settings} label="Admin Dashboard" />
                                        <NavItem to="/admin/users" icon={User} label="Users" />
                                        <NavItem to="/admin/feedback" icon={MessageSquare} label="Feedback" />
                                        <NavItem to="/admin/projects" icon={Folder} label="Projects" />
                                    </>
                                ) : (
                                    <>
                                        <NavItem to="/Profile" icon={User} label="Profile" />
                                        <NavItem to="/Pages" icon={LayoutDashboard} label="Dashboard" />
                                        <NavItem to="/projects" icon={Folder} label="Projects" />
                                        <NavItem to="/Feedback" icon={MessageSquare} label="Feedback" />
                                    </>
                                )}
                                <span className="h-6 w-px bg-gray-200 mx-2"></span>
                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm flex items-center space-x-2"
                                >
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
