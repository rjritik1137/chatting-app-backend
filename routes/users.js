import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Search users by email (case-insensitive, partial match)
router.get('/', auth, async (req, res) => {
  const search = req.query.search || '';
  try {
    const users = await User.find({
      email: { $regex: search, $options: 'i' },
      _id: { $ne: req.user.userId },
    }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 