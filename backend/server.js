// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});

const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration - Allow both local and production URLs
const corsOptions = {
    origin: true, // Allow all origins temporarily to debug connection issues
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/admin', require('./routes/admin'));

// Basic health check route
app.get('/', (req, res) => res.json({ msg: '✅ API is running!' }));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ msg: 'Route not found', path: req.path });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({ 
        msg: err.message || 'Server Error',
        status: err.status || 500
    });
});

const PORT = process.env.PORT || 5001;

// Connect Database
connectDB();

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📍 API Base URL: http://localhost:${PORT}/api\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`❌ Unhandled Promise Rejection: ${err.message}`);
});
