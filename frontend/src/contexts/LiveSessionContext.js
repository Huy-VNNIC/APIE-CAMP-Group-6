import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { getSocket, initializeSocket, disconnectSocket } from '../services/socketService';

export const LiveSessionContext = createContext();

export const LiveSessionProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [currentSession, setCurrentSession] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sharedCode, setSharedCode] = useState({
    code: '// Start coding here\n',
    language: 'javascript'
  });
  const [codeExecutionResult, setCodeExecutionResult] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [sessionStorage] = useState(new Map()); // Local storage for session data

  // Initialize socket when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        // Use a mock token for demo
        const mockToken = "demo-token-123";
        initializeSocket(mockToken, user);
        setupEventListeners();

        return () => {
          disconnectSocket();
        };
      } catch (err) {
        console.error("Failed to initialize socket:", err);
      }
    }
  }, [isAuthenticated, user]);

  // Set up socket event listeners
  const setupEventListeners = () => {
    try {
      const socket = getSocket();

      // Available sessions update
      socket.on('session-created', (sessionData) => {
        console.log('New session created:', sessionData);
        setActiveSessions(prev => [...prev, sessionData]);
        
        // Store session data locally
        sessionStorage.set(sessionData.id, {
          ...sessionData,
          participants: [{
            id: sessionData.instructorId || 'instructor-123',
            username: sessionData.instructorName.toLowerCase().replace(/\s/g, ''),
            role: 'instructor',
            fullName: sessionData.instructorName
          }],
          messages: [],
          sharedCode: {
            language: 'javascript',
            code: '// Welcome to the live coding session!\nconsole.log("Hello world!");'
          }
        });
      });

      socket.on('session-updated', (updateData) => {
        setActiveSessions(prev => 
          prev.map(s => 
            s.id === updateData.id ? { ...s, ...updateData } : s
          )
        );
        
        // Update local session data
        if (sessionStorage.has(updateData.id)) {
          const updatedSession = { ...sessionStorage.get(updateData.id), ...updateData };
          sessionStorage.set(updateData.id, updatedSession);
        }
      });

      // Current session events
      socket.on('participant-joined', (participant) => {
        console.log('Participant joined:', participant);
        setParticipants(prev => [...prev, participant]);
      });

      socket.on('participant-left', (data) => {
        console.log('Participant left:', data);
        setParticipants(prev => 
          prev.filter(p => p.id !== data.userId)
        );
      });

      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('code-updated', (codeData) => {
        setSharedCode({
          code: codeData.code,
          language: codeData.language
        });
      });

      socket.on('code-execution-result', (result) => {
        setCodeExecutionResult(result);
      });

      socket.on('session-ended', (data) => {
        alert(`The session has ended. ${data.reason === 'instructor-disconnected' ? 'The instructor disconnected.' : ''}`);
        leaveSession();
      });
    } catch (error) {
      console.error('Error setting up socket listeners:', error);
    }
  };

  // For testing - add sample active sessions
  useEffect(() => {
    // Add two mock active sessions for demonstration
    if (activeSessions.length === 0) {
      const mockSessions = [
        {
          id: "mock-session-1",
          title: "JavaScript Fundamentals Live Coding",
          instructorName: "John Smith",
          instructorId: "instructor-123",
          courseId: "1",
          participantCount: 5,
          startTime: new Date()
        },
        {
          id: "mock-session-2",
          title: "React Hooks Workshop",
          instructorName: "Emily Davis",
          instructorId: "instructor-456",
          courseId: "3",
          participantCount: 8,
          startTime: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        }
      ];
      
      setActiveSessions(mockSessions);
      
      // Store sessions in local storage
      mockSessions.forEach(session => {
        sessionStorage.set(session.id, {
          ...session,
          participants: [{
            id: session.instructorId,
            username: session.instructorName.toLowerCase().replace(/\s/g, ''),
            role: 'instructor',
            fullName: session.instructorName
          }],
          messages: [{
            id: `msg-init-${session.id}`,
            userId: session.instructorId,
            username: session.instructorName.toLowerCase().replace(/\s/g, ''),
            fullName: session.instructorName,
            role: 'instructor',
            message: 'Welcome to the session! Let\'s start coding.',
            timestamp: new Date(Date.now() - 5 * 60 * 1000)
          }],
          sharedCode: {
            language: 'javascript',
            code: '// Welcome to the live coding session!\nconsole.log("Hello world!");'
          }
        });
      });
    }
  }, [activeSessions.length, sessionStorage]);

  // Create a new session (instructors only)
  const createSession = async (sessionData) => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // For demo purposes, create a mock session immediately
      const mockSessionId = `session-${Date.now()}`;
      const newMockSession = {
        id: mockSessionId,
        title: sessionData.title,
        description: sessionData.description,
        instructorId: user?.id || 'instructor-123',
        instructorName: user?.fullName || user?.username || 'Instructor',
        courseId: sessionData.courseId,
        startTime: new Date(),
        participants: [
          {
            id: user?.id || 'instructor-123',
            username: user?.username || 'instructor',
            role: 'instructor',
            fullName: user?.fullName || user?.username || 'Instructor'
          }
        ],
        messages: [],
        sharedCode: {
          language: 'javascript',
          code: '// Welcome to the live coding session!\nconsole.log("Hello world!");'
        }
      };

      // Add to active sessions
      setActiveSessions(prev => [...prev, {
        id: mockSessionId,
        title: sessionData.title,
        instructorName: newMockSession.instructorName,
        courseId: sessionData.courseId,
        participantCount: 1,
        startTime: newMockSession.startTime
      }]);

      // Store in session storage
      sessionStorage.set(mockSessionId, newMockSession);

      // Set as current session
      setCurrentSession(newMockSession);
      setParticipants(newMockSession.participants);
      setMessages([]);
      setSharedCode(newMockSession.sharedCode);
      
      // Use Socket.io when available
      try {
        const socket = getSocket();
        socket.emit('create-session', sessionData, (response) => {
          if (response && response.success) {
            console.log('Session created successfully via socket');
          }
        });
      } catch (socketErr) {
        console.warn("Using mock session as fallback");
      }

      setIsConnecting(false);
      navigate(`/live-session/${mockSessionId}`);
      return mockSessionId;
      
    } catch (error) {
      setIsConnecting(false);
      setError('Failed to create session: ' + error.message);
      console.error('Error creating session:', error);
      throw error;
    }
  };

  // Join an existing session
  const joinSession = async (sessionId) => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Try to find the session in our session storage
      const existingSession = sessionStorage.get(sessionId);
      
      if (!existingSession) {
        // Check active sessions list if not in storage
        const sessionToJoin = activeSessions.find(s => s.id === sessionId);
        
        if (!sessionToJoin) {
          throw new Error('Session not found: The session may have ended or doesn\'t exist');
        }
        
        // Create a detailed session from the basic info
        const mockDetailedSession = {
          ...sessionToJoin,
          participants: [
            // Add instructor
            {
              id: sessionToJoin.instructorId || 'instructor-123',
              username: sessionToJoin.instructorName.toLowerCase().replace(/\s/g, ''),
              role: 'instructor',
              fullName: sessionToJoin.instructorName
            },
            // Add some mock participants
            {
              id: 'student-1',
              username: 'student1',
              role: 'student',
              fullName: 'Student One'
            },
            {
              id: 'student-2',
              username: 'student2',
              role: 'student',
              fullName: 'Student Two'
            }
          ],
          messages: [
            {
              id: 'msg-1',
              userId: 'instructor-123',
              username: sessionToJoin.instructorName.toLowerCase().replace(/\s/g, ''),
              fullName: sessionToJoin.instructorName,
              role: 'instructor',
              message: 'Welcome to the session! Let\'s start coding.',
              timestamp: new Date(Date.now() - 5 * 60 * 1000)
            }
          ],
          sharedCode: {
            language: 'javascript',
            code: '// Welcome to the live coding session!\nconsole.log("Hello world!");'
          }
        };
        
        // Add the current user to participants
        mockDetailedSession.participants.push({
          id: user?.id || 'student-current',
          username: user?.username || 'currentstudent',
          role: user?.role || 'student',
          fullName: user?.fullName || user?.username || 'Current Student'
        });
        
        // Store in session storage
        sessionStorage.set(sessionId, mockDetailedSession);
        
        // Set session data
        setCurrentSession(mockDetailedSession);
        setParticipants(mockDetailedSession.participants);
        setMessages(mockDetailedSession.messages);
        setSharedCode(mockDetailedSession.sharedCode);
      } else {
        // Use the session from storage
        
        // Add the current user if not already there
        if (!existingSession.participants.some(p => p.id === (user?.id || 'student-current'))) {
          existingSession.participants.push({
            id: user?.id || 'student-current',
            username: user?.username || 'currentstudent',
            role: user?.role || 'student',
            fullName: user?.fullName || user?.username || 'Current Student'
          });
        }
        
        // Set session data
        setCurrentSession(existingSession);
        setParticipants(existingSession.participants);
        setMessages(existingSession.messages);
        setSharedCode(existingSession.sharedCode);
      }
      
      // Try socket connection if available
      try {
        const socket = getSocket();
        socket.emit('join-session', sessionId, (response) => {
          if (response && response.success) {
            console.log('Joined session via socket successfully');
          } else if (response && !response.success) {
            console.warn('Socket response error:', response.message);
            // We continue anyway since we have mock data as backup
          }
        });
      } catch (socketErr) {
        console.warn("Using mock session data as fallback:", socketErr);
      }

      setIsConnecting(false);
      navigate(`/live-session/${sessionId}`);
      return sessionId;
      
    } catch (error) {
      setIsConnecting(false);
      setError('Failed to join session: ' + error.message);
      console.error('Error joining session:', error);
      throw error;
    }
  };

  // Leave the current session
  const leaveSession = () => {
    if (currentSession) {
      try {
        // If user is the instructor, handle session ending
        if (user?.role === 'instructor' && currentSession.instructorId === user?.id) {
          try {
            const socket = getSocket();
            socket.emit('end-session', currentSession.id, () => {
              cleanupSession();
            });
          } catch (err) {
            // If socket fails, still end the session locally
            setActiveSessions(prev => prev.filter(s => s.id !== currentSession.id));
            sessionStorage.delete(currentSession.id);
            cleanupSession();
          }
        } else {
          // Just leave the session
          try {
            const socket = getSocket();
            socket.emit('leave-session', currentSession.id);
          } catch (err) {
            // Silent fail - just clean up locally
          }
          
          // Update participants count
          if (sessionStorage.has(currentSession.id)) {
            const session = sessionStorage.get(currentSession.id);
            session.participants = session.participants.filter(p => 
              p.id !== (user?.id || 'student-current')
            );
            sessionStorage.set(currentSession.id, session);
            
            setActiveSessions(prev => prev.map(s => 
              s.id === currentSession.id 
                ? { ...s, participantCount: s.participantCount - 1 }
                : s
            ));
          }
          
          cleanupSession();
        }
      } catch (err) {
        // If anything fails, still clean up the session state
        cleanupSession();
      }
    } else {
      navigate('/live-sessions');
    }
  };

  // Send a chat message
  const sendMessage = (message) => {
    if (!currentSession) return;
    
    // Create a new message
    const newMessage = {
      id: `msg-${Date.now()}`,
      userId: user?.id || 'current-user',
      username: user?.username || 'user',
      fullName: user?.fullName || user?.username || 'User',
      role: user?.role || 'student',
      message,
      timestamp: new Date()
    };
    
    // Add to messages
    setMessages(prev => [...prev, newMessage]);
    
    // Add to session storage
    if (sessionStorage.has(currentSession.id)) {
      const session = sessionStorage.get(currentSession.id);
      session.messages = [...(session.messages || []), newMessage];
      sessionStorage.set(currentSession.id, session);
    }
    
    // Try to send via socket
    try {
      const socket = getSocket();
      socket.emit('send-message', {
        sessionId: currentSession.id,
        message
      });
    } catch (err) {
      console.warn("Fallback: Added message locally only");
    }
  };

  // Update shared code
  const updateSharedCode = (code, language) => {
    if (!currentSession) return;
    
    const updatedCode = {
      code,
      language: language || sharedCode.language
    };
    
    setSharedCode(updatedCode);
    
    // Update in session storage
    if (sessionStorage.has(currentSession.id)) {
      const session = sessionStorage.get(currentSession.id);
      session.sharedCode = updatedCode;
      sessionStorage.set(currentSession.id, session);
    }
    
    try {
      const socket = getSocket();
      socket.emit('code-update', {
        sessionId: currentSession.id,
        code,
        language
      });
    } catch (err) {
      console.warn("Fallback: Updated code locally only");
    }
  };

  // Run the shared code
  const runCode = () => {
    if (!currentSession) return;
    
    // Mock code execution result
    const mockResult = {
      success: Math.random() > 0.3,
      output: Math.random() > 0.3 ? 
        "Code executed successfully! Output: Hello, World!" : 
        "Error: Unexpected token at line 3",
      executionTime: Math.floor(Math.random() * 1000),
      triggeredBy: user?.id || 'current-user'
    };
    
    // Set the result
    setCodeExecutionResult(mockResult);
    
    // Try socket
    try {
      const socket = getSocket();
      socket.emit('run-code', {
        sessionId: currentSession.id,
        code: sharedCode.code,
        language: sharedCode.language
      });
    } catch (err) {
      console.warn("Fallback: Used mock code execution");
    }
  };

  // Clean up session state
  const cleanupSession = () => {
    setCurrentSession(null);
    setParticipants([]);
    setMessages([]);
    setSharedCode({
      code: '// Start coding here\n',
      language: 'javascript'
    });
    setCodeExecutionResult(null);
    navigate('/live-sessions');
  };

  const value = {
    currentSession,
    activeSessions,
    participants,
    messages,
    sharedCode,
    codeExecutionResult,
    isConnecting,
    error,
    createSession,
    joinSession,
    leaveSession,
    sendMessage,
    updateSharedCode,
    runCode
  };

  return (
    <LiveSessionContext.Provider value={value}>
      {children}
    </LiveSessionContext.Provider>
  );
};
