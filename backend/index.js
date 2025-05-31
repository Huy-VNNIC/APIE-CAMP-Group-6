const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const quizRoutes = require('./routes/quiz.routes');
const sessionRoutes = require('./routes/session.routes');

// Import socket service
const { initializeSocketServer } = require('./services/socketService');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocketServer(server);

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Simple request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/sessions', sessionRoutes);

// Get available sessions
app.get('/api/live-sessions', (req, res) => {
  const sessions = Array.from(io.sockets.sockets.values())
    .filter(socket => socket.session)
    .map(socket => {
      const session = socket.session;
      return {
        id: session.id,
        title: session.title,
        instructorName: session.instructorName,
        courseId: session.courseId,
        participantCount: session.participants.length,
        startTime: session.startTime
      };
    });
  
  res.json({ sessions });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Online Coding Platform API' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
