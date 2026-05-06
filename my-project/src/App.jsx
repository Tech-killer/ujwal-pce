import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminFeedback from './pages/admin/Feedback';
import AdminProjects from './pages/admin/Projects';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('isAdmin');
    if (token) {
      setIsAuthenticated(true);
    }
    if (admin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans transition-colors duration-300">
        <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/Sign" element={<SignUp />} />
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} setAdmin={setIsAdmin} />} />

          {/* Routes accessible to both or specific roles (simplified for valid routing) */}
          <Route path="/project" element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/Pages" element={<Dashboard />} />

          {/* Authenticated Routes */}
          <Route
            path="/Profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/Feedback"
            element={isAuthenticated ? <Feedback /> : <Navigate to="/login" />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/users"
            element={isAdmin ? <AdminUsers /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/feedback"
            element={isAdmin ? <AdminFeedback /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/projects"
            element={isAdmin ? <AdminProjects /> : <Navigate to="/login" />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}