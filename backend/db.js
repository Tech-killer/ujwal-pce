const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not set in environment variables');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully');
        return true;
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        // Still allow server to start but log the error
        return false;
    }
};

module.exports = connectDB;
