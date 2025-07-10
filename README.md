# Chat App Backend

This is the backend for the Chat App, built with Express.js, MongoDB, and Socket.io.

## Features
- User authentication (signup/login) with JWT
- User search
- Real-time chat with Socket.io
- Stores messages and users in MongoDB

## Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a `.env` file** in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```
   - Example for local MongoDB:
     ```
     MONGO_URI=mongodb://localhost:27017/chatapp
     ```
   - Example for MongoDB Atlas:
     ```
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chatapp?retryWrites=true&w=majority
     ```

4. **Start the server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3001` by default.

## API Endpoints

### Auth
- `POST /api/auth/signup` — `{ firstName, lastName, email, password }`
- `POST /api/auth/login` — `{ email, password }`

### Users
- `GET /api/users?search=...` — Search users by email/name (JWT required)

### Chats
- `GET /api/chats/:userId` — Get chat history with a user (JWT required)
- `POST /api/chats` — Send a message `{ receiver, content }` (JWT required)

### Real-time
- Socket.io events for sending/receiving messages

## Notes
- All protected routes require `Authorization: Bearer <token>` header.
- Make sure MongoDB is running and accessible.
- For production, use a secure `JWT_SECRET` and a cloud MongoDB URI.

---

Feel free to contribute or open issues for improvements! 