import { Link } from 'react-router-dom';
import { Building2, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 text-xl font-bold mb-4">
                            <Building2 className="text-blue-600" />
                            <span>PublicPulse</span>
                        </Link>
                        <p className="text-gray-500 leading-relaxed">
                            Empowering citizens to participate in infrastructure development through transparent feedback and accountability.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
                        <ul className="space-y-3 text-gray-500">
                            <li><Link to="/projects" className="hover:text-blue-600 transition-colors">Browse Projects</Link></li>
                            <li><Link to="/Pages" className="hover:text-blue-600 transition-colors">Dashboard</Link></li>
                            <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
                        <ul className="space-y-3 text-gray-500">
                            <li><Link to="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all">
                                <Github size={20} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500">
                    <p>© 2025 PublicPulse. Built for transparency in public infrastructure.</p>
                </div>
            </div>
        </footer>
    );
}
