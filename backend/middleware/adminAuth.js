const User = require('../models/User');
const auth = require('./auth');

const adminAuth = async (req, res, next) => {
    // First validate token
    auth(req, res, async () => {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            if (user.role !== 'admin') {
                return res.status(403).json({ msg: 'You do not have permission to access this resource. Admin access required.' });
            }

            next();
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });
};

module.exports = adminAuth;
