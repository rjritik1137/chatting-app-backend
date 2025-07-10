import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    const token = jwt.sign({ userId: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { email: user.email, _id: user._id, firstName: user.firstName, lastName: user.lastName } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: user.email, _id: user._id, firstName: user.firstName, lastName: user.lastName } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 