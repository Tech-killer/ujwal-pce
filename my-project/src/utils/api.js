// API Configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_TIMEOUT = 15000; // 15 seconds timeout

// Reusable fetch wrapper with error handling and timeout
export const fetchAPI = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['x-auth-token'] = token;
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
        console.log(`🔄 API Request: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || `Error: ${response.status}`);
        }

        console.log(`✅ API Success: ${endpoint}`);
        return { success: true, data };
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('⏱️ API Timeout - Backend server not responding');
            return {
                success: false,
                error: 'Server connection timeout. Backend may be starting up. Please try again in a moment.'
            };
        }
        console.error(`❌ API Error (${endpoint}):`, error.message);
        return { success: false, error: error.message };
    } finally {
        clearTimeout(timeoutId);
    }
};

// Specific API methods
export const authAPI = {
    login: (email, password) => fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    }),
    register: (name, email, password) => fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    }),
    getCurrentUser: () => fetchAPI('/auth'),
};

export const feedbackAPI = {
    submitFeedback: (rating, comments) => fetchAPI('/feedback', {
        method: 'POST',
        body: JSON.stringify({ rating, comments }),
    }),
    getAllFeedback: () => fetchAPI('/feedback'),
};

export default API_BASE_URL;
