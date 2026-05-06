const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const Project = require('../models/Project');

// @route   POST api/feedback
// @desc    Submit feedback
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { projectId, projectTitle, projectLocation, rating, comments } = req.body;

        console.log('📝 Feedback submission attempt:');
        console.log('  projectId:', projectId, 'type:', typeof projectId);
        console.log('  projectTitle:', projectTitle);
        console.log('  userId:', req.user.id);

        // Validate input
        if (!projectId || !projectTitle) {
            return res.status(400).json({ msg: 'Project ID and title are required' });
        }

        if (!rating || !comments) {
            return res.status(400).json({ msg: 'Rating and comments are required' });
        }

        // Validate rating range
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ msg: 'Rating must be a number between 1 and 5' });
        }

        // Validate comments length
        if (comments.trim().length === 0 || comments.trim().length > 500) {
            return res.status(400).json({ msg: 'Comments must be between 1 and 500 characters' });
        }

        // Check if project exists
        const project = await Project.findById(projectId);
        console.log('  Project found:', !!project);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        const newFeedback = new Feedback({
            user: req.user.id,
            projectId,
            projectTitle,
            projectLocation: projectLocation || 'Unknown',
            rating,
            comments: comments.trim()
        });

        const feedback = await newFeedback.save();
        console.log('  Feedback saved, _id:', feedback._id);

        // Increment feedbackCount for the project
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $inc: { feedbackCount: 1 } },
            { new: true }
        );

        console.log('  Project updated, new feedbackCount:', updatedProject?.feedbackCount);

        if (!updatedProject) {
            return res.status(500).json({ msg: 'Failed to update project feedback count' });
        }

        res.json(feedback);
    } catch (err) {
        console.error('❌ Feedback submission error:', err.message);
        res.status(500).json({ msg: 'Server Error - ' + err.message });
    }
});

// @route   GET api/feedback
// @desc    Get all feedback
// @access  Public
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('user', ['name', 'email'])
            .sort({ date: -1 });
        res.json(feedbacks);
    } catch (err) {
        console.error('Get feedback error:', err.message);
        res.status(500).json({ msg: 'Error fetching feedback: ' + err.message });
    }
});

// @route   GET api/feedback/project/:projectId
// @desc    Get feedback count for a specific project
// @access  Public
router.get('/project/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const feedbackCount = await Feedback.countDocuments({ projectId });
        const project = await Project.findById(projectId);
        
        console.log('📊 Project feedback check:');
        console.log('  projectId:', projectId);
        console.log('  Actual feedback count in DB:', feedbackCount);
        console.log('  Project feedbackCount field:', project?.feedbackCount);
        console.log('  Match:', feedbackCount === project?.feedbackCount);
        
        res.json({
            projectId,
            feedbackCount,
            projectFeedbackCount: project?.feedbackCount,
            match: feedbackCount === project?.feedbackCount
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error: ' + err.message });
    }
});

// @route   DELETE api/feedback/:id
// @desc    Delete feedback (admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ msg: 'Feedback not found' });
        }

        // Check if user is admin or owner
        if (req.user.role !== 'admin' && feedback.user.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const projectId = feedback.projectId;

        await Feedback.findByIdAndDelete(req.params.id);

        // Decrement feedbackCount for the project
        await Project.findByIdAndUpdate(
            projectId,
            { $inc: { feedbackCount: -1 } },
            { new: true }
        );

        res.json({ msg: 'Feedback deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
