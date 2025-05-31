const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

// Active sessions storage
const activeSessions = new Map();

function initializeSocketServer(server) {
  const io = socketIo(server, {
    cors: {
      // Allow connections from both port 3000 and 3001
      origin: ["http://localhost:3000", "http://localhost:3001"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`);
    
    // User joined with authentication
    socket.on('authenticate', (userData) => {
      // Store user data in socket for future reference
      socket.user = {
        id: userData.id,
        username: userData.username,
        role: userData.role,
        fullName: userData.fullName
      };
      console.log(`User authenticated: ${socket.user.username}`);
    });

    // Session management - Create new session (instructor only)
    socket.on('create-session', (sessionData, callback) => {
      if (!socket.user || socket.user.role !== 'instructor') {
        return callback({ success: false, message: 'Only instructors can create sessions' });
      }

      const sessionId = uuidv4();
      const newSession = {
        id: sessionId,
        title: sessionData.title,
        description: sessionData.description,
        startTime: new Date(),
        courseId: sessionData.courseId,
        instructorId: socket.user.id,
        instructorName: socket.user.fullName,
        participants: [],
        messages: [],
        status: 'active',
        sharedCode: {
          language: 'javascript',
          code: '// Start coding here\n'
        }
      };

      // Store the session
      activeSessions.set(sessionId, newSession);
      
      // Join the session room
      socket.join(sessionId);
      
      // Add instructor to participants
      newSession.participants.push({
        id: socket.user.id,
        username: socket.user.username,
        role: socket.user.role,
        fullName: socket.user.fullName
      });

      // Broadcast to all users that a new session is available
      io.emit('session-created', {
        id: newSession.id,
        title: newSession.title,
        instructorName: newSession.instructorName,
        courseId: newSession.courseId,
        participantCount: 1,
        startTime: newSession.startTime
      });

      callback({ success: true, sessionId });
    });

    // Student joins a session
    socket.on('join-session', (sessionId, callback) => {
      if (!socket.user) {
        return callback({ success: false, message: 'Authentication required' });
      }

      const session = activeSessions.get(sessionId);
      if (!session) {
        return callback({ success: false, message: 'Session not found' });
      }

      // Add to participants if not already in
      if (!session.participants.find(p => p.id === socket.user.id)) {
        session.participants.push({
          id: socket.user.id,
          username: socket.user.username,
          role: socket.user.role,
          fullName: socket.user.fullName
        });
      }

      // Join the session room
      socket.join(sessionId);
      
      // Update all participants in the session about the new user
      io.to(sessionId).emit('participant-joined', {
        userId: socket.user.id,
        username: socket.user.username,
        role: socket.user.role,
        fullName: socket.user.fullName
      });
      
      // Update active session count
      io.emit('session-updated', {
        id: sessionId,
        participantCount: session.participants.length
      });

      // Return session data to the user
      callback({ 
        success: true, 
        session: {
          ...session,
          participants: session.participants.length // Just send count for data efficiency
        }
      });
    });

    // Chat message in a session
    socket.on('send-message', (data) => {
      if (!socket.user) return;
      
      const { sessionId, message } = data;
      const session = activeSessions.get(sessionId);
      
      if (!session) return;
      
      const newMessage = {
        id: uuidv4(),
        userId: socket.user.id,
        username: socket.user.username,
        fullName: socket.user.fullName,
        role: socket.user.role,
        message,
        timestamp: new Date()
      };
      
      // Store the message
      session.messages.push(newMessage);
      
      // Broadcast to all participants
      io.to(sessionId).emit('new-message', newMessage);
    });

    // Code update in a session
    socket.on('code-update', (data) => {
      if (!socket.user) return;
      
      const { sessionId, code, language } = data;
      const session = activeSessions.get(sessionId);
      
      if (!session) return;
      
      // Update the shared code
      session.sharedCode = {
        language: language || session.sharedCode.language,
        code,
        lastUpdatedBy: socket.user.id,
        lastUpdatedAt: new Date()
      };
      
      // Broadcast to all participants except sender
      socket.to(sessionId).emit('code-updated', {
        code,
        language: session.sharedCode.language,
        updatedBy: socket.user.username
      });
    });

    // Run code in a session
    socket.on('run-code', (data) => {
      if (!socket.user) return;
      
      const { sessionId, code, language } = data;
      const session = activeSessions.get(sessionId);
      
      if (!session) return;
      
      // In a real implementation, you would actually run the code using a sandbox
      // For this demo, we'll simulate code execution with a delay
      setTimeout(() => {
        const results = {
          success: Math.random() > 0.3, // Simulate some failures
          output: Math.random() > 0.3 ? 
            "Code executed successfully! Output: Hello, World!" : 
            "Error: Unexpected token at line 3",
          executionTime: Math.floor(Math.random() * 1000),
          triggeredBy: socket.user.id
        };
        
        // Broadcast results to all participants
        io.to(sessionId).emit('code-execution-result', results);
      }, 1500);
    });

    // End a session (instructor only)
    socket.on('end-session', (sessionId, callback) => {
      if (!socket.user || socket.user.role !== 'instructor') {
        return callback({ success: false, message: 'Only instructors can end sessions' });
      }

      const session = activeSessions.get(sessionId);
      if (!session) {
        return callback({ success: false, message: 'Session not found' });
      }

      if (session.instructorId !== socket.user.id) {
        return callback({ success: false, message: 'Only the session creator can end it' });
      }
      
      // Archive the session (in a real app, you'd save to database)
      session.status = 'ended';
      session.endTime = new Date();
      
      // Notify all participants
      io.to(sessionId).emit('session-ended', {
        sessionId,
        endedBy: socket.user.username,
        duration: (session.endTime - session.startTime) / 1000 // in seconds
      });
      
      // Remove from active sessions
      activeSessions.delete(sessionId);
      
      callback({ success: true });
    });

    // Handle disconnects
    socket.on('disconnect', () => {
      if (!socket.user) return;
      
      console.log(`User disconnected: ${socket.id}`);
      
      // Update all sessions the user was part of
      activeSessions.forEach((session, sessionId) => {
        const participantIndex = session.participants.findIndex(p => p.id === socket.user.id);
        
        if (participantIndex !== -1) {
          // Remove from participants
          session.participants.splice(participantIndex, 1);
          
          // If instructor left, end the session
          if (session.instructorId === socket.user.id) {
            session.status = 'ended';
            session.endTime = new Date();
            
            // Notify all participants
            io.to(sessionId).emit('session-ended', {
              sessionId,
              endedBy: socket.user.username,
              reason: 'instructor-disconnected',
              duration: (session.endTime - session.startTime) / 1000
            });
            
            // Remove from active sessions
            activeSessions.delete(sessionId);
          } else {
            // Notify others that this participant left
            io.to(sessionId).emit('participant-left', {
              userId: socket.user.id,
              username: socket.user.username
            });
            
            // Update active sessions list
            io.emit('session-updated', {
              id: sessionId,
              participantCount: session.participants.length
            });
          }
        }
      });
    });
  });

  return io;
}

module.exports = { initializeSocketServer };
