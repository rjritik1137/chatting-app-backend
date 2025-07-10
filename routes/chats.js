import express from 'express';
import Chat from '../models/Chat.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get chat history with another user
router.get('/:userId', auth, async (req, res) => {
  const { userId } = req.params;
  try {
    const chats = await Chat.find({
      $or: [
        { sender: req.user.userId, receiver: userId },
        { sender: userId, receiver: req.user.userId },
      ],
    }).sort('timestamp');
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  const { receiver, content } = req.body;
  try {
    const chat = await Chat.create({
      sender: req.user.userId,
      receiver,
      content,
    });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 