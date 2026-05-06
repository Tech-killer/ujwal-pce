// Seed script to create first admin user
// Run this script once: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('MONGO_URI not defined in .env file');
        }

        await mongoose.connect(mongoURI);
        console.log('📦 Connected to MongoDB');

        // Check if admin already exists
        let admin = await User.findOne({ email: 'admin@example.com' });

        if (admin) {
            console.log('⚠️  Admin user already exists');
            console.log(`   Email: ${admin.email}`);
            console.log(`   Role: ${admin.role}`);
            
            // Just ensure the role is admin
            if (admin.role !== 'admin') {
                admin.role = 'admin';
                await admin.save();
                console.log('✅ Updated existing user to admin');
            }
        } else {
            // Create new admin user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin@123', salt);

            const newAdmin = new User({
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
            });

            await newAdmin.save();
            console.log('✅ Admin user created successfully!');
            console.log('   Email: admin@example.com');
            console.log('   Password: admin@123');
            console.log('   Role: admin');
        }

        console.log('\n💡 You can now login with admin credentials');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error seeding database:', err.message);
        process.exit(1);
    }
};

seedDatabase();
