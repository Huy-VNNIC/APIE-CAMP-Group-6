// frontend/src/contexts/LiveSessionContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { getSocket, initializeSocket, disconnectSocket } from '../services/socketService';

export const LiveSessionContext = createContext();

export const LiveSessionProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useContext(UserContext);
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

  // Initialize socket when user authenticates
  useEffect(() => {
    if (isAuthenticated && token && user) {
      initializeSocket(token, user);
      setupEventListeners();

      return () => {
        disconnectSocket();
      };
    }
  }, [isAuthenticated, token, user]);

  // Set up socket event listeners
  const setupEventListeners = () => {
    const socket = getSocket();

    // Available sessions update
    socket.on('session-created', (sessionData) => {
      setActiveSessions(prev => [...prev, sessionData]);
    });

    socket.on('session-updated', (updateData) => {
      setActiveSessions(prev => 
        prev.map(s => 
          s.id === updateData.id ? { ...s, ...updateData } : s
        )
      );
    });

    // Current session events
    socket.on('participant-joined', (participant) => {
      setParticipants(prev => [...prev, participant]);
    });

    socket.on('participant-left', (data) => {
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
  };

  // Create a new session (instructors only)
  const createSession = async (sessionData) => {
    try {
      setIsConnecting(true);
      const socket = getSocket();
      
      return new Promise((resolve, reject) => {
        socket.emit('create-session', sessionData, (response) => {
          setIsConnecting(false);
          
          if (response.success) {
            setCurrentSession({
              id: response.sessionId,
              ...sessionData,
              instructorId: user.id,
              instructorName: user.fullName,
              startTime: new Date()
            });
            setParticipants([{
              id: user.id,
              username: user.username,
              role: user.role,
              fullName: user.fullName
            }]);
            setMessages([]);
            navigate(`/live-session/${response.sessionId}`);
            resolve(response.sessionId);
          } else {
            reject(new Error(response.message));
          }
        });
      });
    } catch (error) {
      setIsConnecting(false);
      console.error('Error creating session:', error);
      throw error;
    }
  };

  // Join an existing session
  const joinSession = async (sessionId) => {
    try {
      setIsConnecting(true);
      const socket = getSocket();
      
      return new Promise((resolve, reject) => {
        socket.emit('join-session', sessionId, (response) => {
          setIsConnecting(false);
          
          if (response.success) {
            setCurrentSession(response.session);
            setParticipants(response.session.participants);
            setMessages(response.session.messages || []);
            setSharedCode(response.session.sharedCode || {
              code: '// Start coding here\n',
              language: 'javascript'
            });
            navigate(`/live-session/${sessionId}`);
            resolve(sessionId);
          } else {
            reject(new Error(response.message));
          }
        });
      });
    } catch (error) {
      setIsConnecting(false);
      console.error('Error joining session:', error);
      throw error;
    }
  };

  // Leave the current session
  const leaveSession = () => {
    if (currentSession) {
      const socket = getSocket();
      
      // If user is the instructor, end the session
      if (user.role === 'instructor' && currentSession.instructorId === user.id) {
        socket.emit('end-session', currentSession.id, (response) => {
          if (response.success) {
            cleanupSession();
          }
        });
      } else {
        // Just leave the session
        socket.emit('leave-session', currentSession.id);
        cleanupSession();
      }
    }
  };

  // Send a chat message
  const sendMessage = (message) => {
    if (!currentSession) return;
    
    const socket = getSocket();
    socket.emit('send-message', {
      sessionId: currentSession.id,
      message
    });
  };

  // Update shared code
  const updateSharedCode = (code, language) => {
    if (!currentSession) return;
    
    setSharedCode({
      code,
      language: language || sharedCode.language
    });
    
    const socket = getSocket();
    socket.emit('code-update', {
      sessionId: currentSession.id,
      code,
      language
    });
  };

  // Run the shared code
  const runCode = () => {
    if (!currentSession) return;
    
    const socket = getSocket();
    socket.emit('run-code', {
      sessionId: currentSession.id,
      code: sharedCode.code,
      language: sharedCode.language
    });
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
    navigate('/dashboard');
  };

  const value = {
    currentSession,
    activeSessions,
    participants,
    messages,
    sharedCode,
    codeExecutionResult,
    isConnecting,
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