// Import required modules
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import custom modules
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import chatRoutes from './routes/chats.js';
import Chat from './models/Chat.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);

// Set up Socket.io for real-time communication
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (for development)
    methods: ['GET', 'POST']
  }
});

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

// Set up API routes
app.use('/api/auth', authRoutes); // Authentication routes (signup/login)
app.use('/api/users', userRoutes); // User search route
app.use('/api/chats', chatRoutes); // Chat/message routes

// Connect to MongoDB database
connectDB();

// Map to keep track of online users (userId -> socketId)
const onlineUsers = new Map();

// Handle Socket.io connections
io.on('connection', (socket) => {
  // When a user connects, they send their userId to identify themselves
  socket.on('setup', (userId) => {
    onlineUsers.set(userId, socket.id); // Save mapping
    socket.userId = userId; // Attach userId to socket for cleanup
  });

  // Listen for sendMessage event from client
  socket.on('sendMessage', async ({ sender, receiver, content, id }) => {
    // Save the message to the database
    const chat = await Chat.findById({_id: id });
    // If the receiver is online, send them the message in real-time
    const receiverSocketId = onlineUsers.get(receiver);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', chat);
    }
  });

  // When a user disconnects, remove them from the online users map
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Start the server

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 