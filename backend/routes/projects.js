const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Project = require('../models/Project');

// @route   GET /api/projects
// @desc    Get all projects (PUBLIC)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ date: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        
        res.json(project);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/projects
// @desc    Create new project (ADMIN ONLY)
// @access  Private/Admin
router.post('/', adminAuth, async (req, res) => {
    const { title, state, sector, status, rating, feedbackCount, description } = req.body;

    try {
        // Validate input
        if (!title || !state || !sector || !status || !rating) {
            return res.status(400).json({ msg: 'All required fields must be provided' });
        }

        // Validate rating
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ msg: 'Rating must be a number between 1 and 5' });
        }

        // Check if project already exists
        let project = await Project.findOne({ title });
        if (project) {
            return res.status(400).json({ msg: 'Project already exists' });
        }

        project = new Project({
            title,
            state,
            sector,
            status,
            rating,
            feedbackCount: feedbackCount || 0,
            description: description || ''
        });

        await project.save();
        res.json({ msg: 'Project created successfully', project });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project (ADMIN ONLY)
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
    const { title, state, sector, status, rating, feedbackCount, description } = req.body;

    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // Update fields
        if (title) project.title = title;
        if (state) project.state = state;
        if (sector) project.sector = sector;
        if (status) project.status = status;
        if (rating !== undefined) project.rating = rating;
        if (feedbackCount !== undefined) project.feedbackCount = feedbackCount;
        if (description !== undefined) project.description = description;

        await project.save();
        res.json({ msg: 'Project updated successfully', project });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project (ADMIN ONLY)
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        await Project.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Project deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
