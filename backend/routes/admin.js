const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');

// @route   GET api/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ date: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/admins
// @desc    Get all admins
// @access  Private/Admin
router.get('/admins', adminAuth, async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password').sort({ date: -1 });
        res.json(admins);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users/:id
// @desc    Get user by ID (admin only)
// @access  Private/Admin
router.get('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/make-admin
// @desc    Promote user to admin (admin only)
// @access  Private/Admin
router.post('/make-admin', adminAuth, async (req, res) => {
    const { userId } = req.body;

    try {
        // Validate input
        if (!userId) {
            return res.status(400).json({ msg: 'User ID is required' });
        }

        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ msg: 'User is already an admin' });
        }

        user.role = 'admin';
        await user.save();

        res.json({ msg: 'User promoted to admin successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invalid user ID' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/remove-admin
// @desc    Demote admin to user (admin only)
// @access  Private/Admin
router.post('/remove-admin', adminAuth, async (req, res) => {
    const { userId } = req.body;

    try {
        // Validate input
        if (!userId) {
            return res.status(400).json({ msg: 'User ID is required' });
        }

        // Prevent admin from removing themselves
        if (userId === req.user.id) {
            return res.status(400).json({ msg: 'You cannot remove your own admin privileges' });
        }

        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({ msg: 'User is not an admin' });
        }

        user.role = 'user';
        await user.save();

        res.json({ msg: 'Admin demoted to user successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invalid user ID' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id === req.user.id) {
            return res.status(400).json({ msg: 'You cannot delete your own account' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await User.findByIdAndRemove(req.params.id);

        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
