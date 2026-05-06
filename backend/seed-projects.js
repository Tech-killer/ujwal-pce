require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');
const Feedback = require('./models/Feedback');

async function seedProjects() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing projects and feedback
        await Project.deleteMany({});
        await Feedback.deleteMany({});
        console.log('Cleared existing projects and feedback');

        // Sample projects data - all with feedbackCount: 0
        const projects = [
            {
                title: 'Renovation of a School Project',
                state: 'New York',
                sector: 'Renovation',
                status: 'On hold',
                rating: 4.1,
                feedbackCount: 0,
                description: 'School renovation project in New York'
            },
            {
                title: 'Commercial Center Construction Project',
                state: 'Georgia',
                sector: 'Construction',
                status: 'On Track',
                rating: 3.1,
                feedbackCount: 0,
                description: 'Commercial center construction in Georgia'
            },
            {
                title: 'Sports Stadium Upgrade Project',
                state: 'Florida',
                sector: 'Other',
                status: 'Completed',
                rating: 4.5,
                feedbackCount: 0,
                description: 'Sports stadium upgrade in Florida'
            },
            {
                title: 'Innovation of a Classroom Project',
                state: 'Florida',
                sector: 'Innovation',
                status: 'On hold',
                rating: 3.8,
                feedbackCount: 0,
                description: 'Classroom innovation project in Florida'
            },
            {
                title: 'Bridge Maintenance Project',
                state: 'Florida',
                sector: 'Maintenance',
                status: 'On Track',
                rating: 3.1,
                feedbackCount: 0,
                description: 'Bridge maintenance project in Florida'
            },
            {
                title: 'Road Expansion Project',
                state: 'Illinois',
                sector: 'Infrastructure',
                status: 'Behind',
                rating: 4.5,
                feedbackCount: 0,
                description: 'Road expansion project in Illinois'
            },
            {
                title: 'Airport Expansion Project',
                state: 'Michigan',
                sector: 'Other',
                status: 'On hold',
                rating: 3.2,
                feedbackCount: 0,
                description: 'Airport expansion project in Michigan'
            },
            {
                title: 'Building a Park Project',
                state: 'New York',
                sector: 'Other',
                status: 'On Track',
                rating: 3.9,
                feedbackCount: 0,
                description: 'Park building project in New York'
            },
            {
                title: 'Office Building Renovation Project',
                state: 'North Carolina',
                sector: 'Renovation',
                status: 'Behind',
                rating: 4.2,
                feedbackCount: 0,
                description: 'Office building renovation in North Carolina'
            },
            {
                title: 'Apartment Complex Development Project',
                state: 'California',
                sector: 'Other',
                status: 'On Track',
                rating: 3.9,
                feedbackCount: 0,
                description: 'Apartment complex development in California'
            },
            {
                title: 'Public Library Renovation Project',
                state: 'Pennsylvania',
                sector: 'Renovation',
                status: 'On hold',
                rating: 3.1,
                feedbackCount: 0,
                description: 'Library renovation project in Pennsylvania'
            },
            {
                title: 'Construction of a Hospital Wing Project',
                state: 'Michigan',
                sector: 'Construction',
                status: 'On hold',
                rating: 4.9,
                feedbackCount: 0,
                description: 'Hospital wing construction in Michigan'
            }
        ];

        // Insert projects
        await Project.insertMany(projects);
        console.log(`✅ ${projects.length} projects created successfully with feedbackCount: 0`);

        // Display all projects
        const allProjects = await Project.find();
        console.log('\n📋 All projects:');
        allProjects.forEach(p => {
            console.log(`- ${p.title} (${p.state}) - Rating: ${p.rating} - Status: ${p.status} - Feedback: ${p.feedbackCount}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

seedProjects();
