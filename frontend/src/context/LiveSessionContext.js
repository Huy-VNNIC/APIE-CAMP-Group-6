// frontend/src/contexts/LiveSessionContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { getSocket, initializeSocket, disconnectSocket } from '../services/socketService';

export const LiveSessionContext = createContext();

export const LiveSessionProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  
  // Basic session states
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
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  // Advanced instructor features
  const [sessionSettings, setSessionSettings] = useState({
    allowStudentCode: true,
    allowChat: true,
    allowHandRaise: true,
    enableRecording: false,
    maxParticipants: 30,
    codeVisibility: 'all', // 'all', 'groups', 'individual', 'readonly'
    focusMode: false
  });

  const [polls, setPolls] = useState([]);
  const [activePoll, setActivePoll] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [breakoutRooms, setBreakoutRooms] = useState([]);
  const [analytics, setAnalytics] = useState({
    engagement: {},
    participation: {},
    codeActivity: {}
  });
  const [handRaisedStudents, setHandRaisedStudents] = useState([]);
  const [sessionRecording, setSessionRecording] = useState({
    isRecording: false,
    recordingId: null,
    startTime: null
  });

  // Initialize socket when user authenticates
  useEffect(() => {
    if (isAuthenticated && token && user) {
      initializeSocket(token, user);
      setupEventListeners();
      loadActiveSessions();

      return () => {
        disconnectSocket();
      };
    }
  }, [isAuthenticated, token, user]);

  // Load active sessions from server
  const loadActiveSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/sessions/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const sessions = await response.json();
        setActiveSessions(sessions);
      }
    } catch (error) {
      console.error('Error loading active sessions:', error);
    }
  }, [token]);

  // Set up socket event listeners
  const setupEventListeners = useCallback(() => {
    const socket = getSocket();

    // Session management events
    socket.on('session-created', (sessionData) => {
      setActiveSessions(prev => [...prev, sessionData]);
    });

    socket.on('session-updated', (updateData) => {
      setActiveSessions(prev => 
        prev.map(s => 
          s.id === updateData.id ? { ...s, ...updateData } : s
        )
      );
      
      if (currentSession && currentSession.id === updateData.id) {
        setCurrentSession(prev => ({ ...prev, ...updateData }));
      }
    });

    socket.on('session-ended', (data) => {
      if (currentSession && currentSession.id === data.sessionId) {
        alert(`Session ended. ${data.reason || ''}`);
        cleanupSession();
      }
      setActiveSessions(prev => prev.filter(s => s.id !== data.sessionId));
    });

    // Participant events
    socket.on('participant-joined', (participant) => {
      setParticipants(prev => [...prev, participant]);
      updateAnalytics('participation', participant.id, 'joined');
    });

    socket.on('participant-left', (data) => {
      setParticipants(prev => prev.filter(p => p.id !== data.userId));
      setHandRaisedStudents(prev => prev.filter(id => id !== data.userId));
    });

    socket.on('hand-raised', (data) => {
      setHandRaisedStudents(prev => 
        prev.includes(data.userId) ? prev : [...prev, data.userId]
      );
    });

    socket.on('hand-lowered', (data) => {
      setHandRaisedStudents(prev => prev.filter(id => id !== data.userId));
    });

    // Communication events
    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }]);
    });

    socket.on('broadcast-message', (message) => {
      setMessages(prev => [...prev, {
        ...message,
        type: 'broadcast',
        timestamp: new Date(message.timestamp)
      }]);
    });

    // Code sharing events
    socket.on('code-updated', (codeData) => {
      setSharedCode({
        code: codeData.code,
        language: codeData.language,
        updatedBy: codeData.updatedBy,
        timestamp: new Date(codeData.timestamp)
      });
      updateAnalytics('codeActivity', codeData.updatedBy, 'code_update');
    });

    socket.on('code-execution-result', (result) => {
      setCodeExecutionResult({
        ...result,
        timestamp: new Date(result.timestamp)
      });
    });

    // Advanced features events
    socket.on('poll-created', (poll) => {
      setPolls(prev => [...prev, poll]);
      setActivePoll(poll);
    });

    socket.on('poll-response', (response) => {
      setActivePoll(prev => {
        if (!prev || prev.id !== response.pollId) return prev;
        
        const updatedResponses = {
          ...prev.responses,
          [response.userId]: response.answer
        };
        
        return {
          ...prev,
          responses: updatedResponses,
          responseCount: Object.keys(updatedResponses).length
        };
      });
    });

    socket.on('poll-ended', (pollId) => {
      setActivePoll(null);
      setPolls(prev => 
        prev.map(p => 
          p.id === pollId ? { ...p, isActive: false, endTime: new Date() } : p
        )
      );
    });

    socket.on('quiz-assigned', (quiz) => {
      setQuizzes(prev => [...prev, quiz]);
    });

    socket.on('breakout-rooms-created', (rooms) => {
      setBreakoutRooms(rooms);
    });

    socket.on('session-settings-updated', (newSettings) => {
      setSessionSettings(prev => ({ ...prev, ...newSettings }));
    });

    socket.on('recording-started', (recordingData) => {
      setSessionRecording({
        isRecording: true,
        recordingId: recordingData.recordingId,
        startTime: new Date(recordingData.startTime)
      });
    });

    socket.on('recording-stopped', () => {
      setSessionRecording({
        isRecording: false,
        recordingId: null,
        startTime: null
      });
    });

    // Analytics events
    socket.on('analytics-update', (analyticsData) => {
      setAnalytics(prev => ({
        ...prev,
        ...analyticsData
      }));
    });

    // Error handling
    socket.on('error', (errorData) => {
      setError(errorData.message);
      console.error('Socket error:', errorData);
    });

  }, [currentSession]);

  // Update analytics helper
  const updateAnalytics = useCallback((type, userId, action) => {
    setAnalytics(prev => {
      const newAnalytics = { ...prev };
      
      if (!newAnalytics[type]) {
        newAnalytics[type] = {};
      }
      
      if (!newAnalytics[type][userId]) {
        newAnalytics[type][userId] = [];
      }
      
      newAnalytics[type][userId].push({
        action,
        timestamp: new Date()
      });
      
      return newAnalytics;
    });
  }, []);

  // Create a new session (instructors only)
  const createSession = async (sessionData) => {
    if (!isAuthenticated || user.role !== 'instructor') {
      throw new Error('Only instructors can create sessions');
    }

    try {
      setIsCreating(true);
      setError(null);
      const socket = getSocket();
      
      const sessionPayload = {
        ...sessionData,
        settings: sessionSettings,
        instructorId: user.id,
        instructorName: user.fullName || user.username
      };
      
      return new Promise((resolve, reject) => {
        socket.emit('create-session', sessionPayload, (response) => {
          setIsCreating(false);
          
          if (response.success) {
            const newSession = {
              id: response.sessionId,
              ...sessionPayload,
              startTime: new Date(),
              participantCount: 1
            };
            
            setCurrentSession(newSession);
            setParticipants([{
              id: user.id,
              username: user.username,
              role: user.role,
              fullName: user.fullName || user.username,
              joinedAt: new Date()
            }]);
            setMessages([]);
            setHandRaisedStudents([]);
            
            // Store in localStorage for persistence
            localStorage.setItem('currentSession', JSON.stringify(newSession));
            localStorage.setItem('joinedSession', JSON.stringify({
              id: response.sessionId,
              role: 'instructor',
              joinedAt: new Date().toISOString()
            }));
            
            navigate(`/live-session/${response.sessionId}`);
            resolve(response.sessionId);
          } else {
            setError(response.message);
            reject(new Error(response.message));
          }
        });
      });
    } catch (error) {
      setIsCreating(false);
      setError(error.message);
      console.error('Error creating session:', error);
      throw error;
    }
  };

  // Join an existing session
  const joinSession = async (sessionId, password = null) => {
    try {
      setIsConnecting(true);
      setError(null);
      const socket = getSocket();
      
      return new Promise((resolve, reject) => {
        socket.emit('join-session', { sessionId, password }, (response) => {
          setIsConnecting(false);
          
          if (response.success) {
            setCurrentSession(response.session);
            setParticipants(response.session.participants || []);
            setMessages(response.session.messages || []);
            setSharedCode(response.session.sharedCode || {
              code: '// Start coding here\n',
              language: 'javascript'
            });
            setSessionSettings(response.session.settings || sessionSettings);
            setPolls(response.session.polls || []);
            setActivePoll(response.session.activePoll || null);
            setBreakoutRooms(response.session.breakoutRooms || []);
            setHandRaisedStudents(response.session.handRaisedStudents || []);
            
            // Store in localStorage
            localStorage.setItem('currentSession', JSON.stringify(response.session));
            localStorage.setItem('joinedSession', JSON.stringify({
              id: sessionId,
              role: user.role,
              joinedAt: new Date().toISOString()
            }));
            
            navigate(`/live-session/${sessionId}`);
            resolve(sessionId);
          } else {
            setError(response.message);
            if (response.passwordRequired) {
              resolve({ passwordRequired: true });
            } else {
              reject(new Error(response.message));
            }
          }
        });
      });
    } catch (error) {
      setIsConnecting(false);
      setError(error.message);
      console.error('Error joining session:', error);
      throw error;
    }
  };

  // Leave the current session
  const leaveSession = useCallback(() => {
    if (currentSession) {
      const socket = getSocket();
      
      // If user is the instructor, show confirmation before ending session
      if (user.role === 'instructor' && currentSession.instructorId === user.id) {
        const shouldEndSession = window.confirm(
          'You are the instructor of this session. Leaving will end the session for all participants. Are you sure?'
        );
        
        if (shouldEndSession) {
          socket.emit('end-session', {
            sessionId: currentSession.id,
            reason: 'instructor-left'
          });
        } else {
          return false; // Don't leave
        }
      } else {
        socket.emit('leave-session', currentSession.id);
      }
      
      cleanupSession();
      return true;
    }
  }, [currentSession, user]);

  // Send a chat message
  const sendMessage = useCallback((messageText, type = 'chat') => {
    if (!currentSession || !messageText.trim()) return;
    
    const socket = getSocket();
    socket.emit('send-message', {
      sessionId: currentSession.id,
      message: messageText,
      type,
      sender: {
        id: user.id,
        username: user.username,
        fullName: user.fullName || user.username,
        role: user.role
      }
    });
  }, [currentSession, user]);

  // Send broadcast message (instructor only)
  const sendBroadcastMessage = useCallback((messageText) => {
    if (!currentSession || user.role !== 'instructor') return;
    
    const socket = getSocket();
    socket.emit('broadcast-message', {
      sessionId: currentSession.id,
      message: messageText,
      sender: {
        id: user.id,
        username: user.username,
        fullName: user.fullName || user.username,
        role: user.role
      }
    });
  }, [currentSession, user]);

  // Update shared code
  const updateSharedCode = useCallback((code, language) => {
    if (!currentSession) return;
    
    const newCodeData = {
      code,
      language: language || sharedCode.language,
      updatedBy: user.id,
      timestamp: new Date()
    };
    
    setSharedCode(newCodeData);
    
    const socket = getSocket();
    socket.emit('code-update', {
      sessionId: currentSession.id,
      ...newCodeData
    });
  }, [currentSession, user, sharedCode.language]);

  // Run the shared code
  const runCode = useCallback(() => {
    if (!currentSession) return;
    
    const socket = getSocket();
    socket.emit('run-code', {
      sessionId: currentSession.id,
      code: sharedCode.code,
      language: sharedCode.language,
      requestedBy: user.id
    });
  }, [currentSession, sharedCode, user]);

  // Raise/lower hand (students)
  const toggleHandRaise = useCallback(() => {
    if (!currentSession || user.role !== 'student') return;
    
    const socket = getSocket();
    const isRaised = handRaisedStudents.includes(user.id);
    
    socket.emit(isRaised ? 'lower-hand' : 'raise-hand', {
      sessionId: currentSession.id,
      userId: user.id
    });
  }, [currentSession, user, handRaisedStudents]);

  // Create poll (instructor only)
  const createPoll = useCallback((pollData) => {
    if (!currentSession || user.role !== 'instructor') return;
    
    const socket = getSocket();
    socket.emit('create-poll', {
      sessionId: currentSession.id,
      poll: {
        ...pollData,
        id: `poll-${Date.now()}`,
        createdBy: user.id,
        createdAt: new Date(),
        isActive: true,
        responses: {}
      }
    });
  }, [currentSession, user]);

  // End poll (instructor only)
  const endPoll = useCallback((pollId) => {
    if (!currentSession || user.role !== 'instructor') return;
    
    const socket = getSocket();
    socket.emit('end-poll', {
      sessionId: currentSession.id,
      pollId
    });
  }, [currentSession, user]);

  // Respond to poll (students)
  const respondToPoll = useCallback((pollId, answer) => {
    if (!currentSession || !activePoll || activePoll.id !== pollId) return;
    
    const socket = getSocket();
    socket.emit('poll-response', {
      sessionId: currentSession.id,
      pollId,
      userId: user.id,
      answer
    });
  }, [currentSession, activePoll, user]);

  // Create breakout rooms (instructor only)
  const createBreakoutRooms = useCallback((roomsData) => {
    if (!currentSession || user.role !== 'instructor') return;
    
    const socket = getSocket();
    socket.emit('create-breakout-rooms', {
      sessionId: currentSession.id,
      rooms: roomsData
    });
  }, [currentSession, user]);

  // Update session settings (instructor only)
  const updateSessionSettings = useCallback((newSettings) => {
    if (!currentSession || user.role !== 'instructor') return;
    
    const updatedSettings = { ...sessionSettings, ...newSettings };
    setSessionSettings(updatedSettings);
    
    const socket = getSocket();
    socket.emit('update-session-settings', {
      sessionId: currentSession.id,
      settings: updatedSettings
    });
  }, [currentSession, user, sessionSettings]);

  // Start/stop recording (instructor only)
  const toggleRecording = useCallback(() => {
    if (!currentSession || user.role !== 'instructor') return;
    
    const socket = getSocket();
    
    if (sessionRecording.isRecording) {
      socket.emit('stop-recording', {
        sessionId: currentSession.id,
        recordingId: sessionRecording.recordingId
      });
    } else {
      socket.emit('start-recording', {
        sessionId: currentSession.id
      });
    }
  }, [currentSession, user, sessionRecording]);

  // Clean up session state
  const cleanupSession = useCallback(() => {
    setCurrentSession(null);
    setParticipants([]);
    setMessages([]);
    setSharedCode({
      code: '// Start coding here\n',
      language: 'javascript'
    });
    setCodeExecutionResult(null);
    setPolls([]);
    setActivePoll(null);
    setQuizzes([]);
    setBreakoutRooms([]);
    setHandRaisedStudents([]);
    setSessionRecording({
      isRecording: false,
      recordingId: null,
      startTime: null
    });
    setAnalytics({
      engagement: {},
      participation: {},
      codeActivity: {}
    });
    
    // Clear localStorage
    localStorage.removeItem('currentSession');
    localStorage.removeItem('joinedSession');
    
    navigate('/dashboard');
  }, [navigate]);

  // Initialize from localStorage on app start
  useEffect(() => {
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession && isAuthenticated) {
      try {
        const session = JSON.parse(savedSession);
        // Validate session is still active
        const socket = getSocket();
        if (socket) {
          socket.emit('validate-session', session.id, (response) => {
            if (response.valid) {
              setCurrentSession(session);
            } else {
              localStorage.removeItem('currentSession');
              localStorage.removeItem('joinedSession');
            }
          });
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('currentSession');
        localStorage.removeItem('joinedSession');
      }
    }
  }, [isAuthenticated]);

  const value = {
    // Basic states
    currentSession,
    activeSessions,
    participants,
    messages,
    sharedCode,
    codeExecutionResult,
    isConnecting,
    isCreating,
    error,
    
    // Advanced features
    sessionSettings,
    polls,
    activePoll,
    quizzes,
    breakoutRooms,
    analytics,
    handRaisedStudents,
    sessionRecording,
    
    // Basic functions
    createSession,
    joinSession,
    leaveSession,
    sendMessage,
    updateSharedCode,
    runCode,
    
    // Advanced functions
    sendBroadcastMessage,
    toggleHandRaise,
    createPoll,
    endPoll,
    respondToPoll,
    createBreakoutRooms,
    updateSessionSettings,
    toggleRecording,
    
    // Utility functions
    cleanupSession,
    loadActiveSessions,
    
    // Helper getters
    isInstructor: user?.role === 'instructor',
    isInCurrentSession: !!currentSession,
    handRaisedCount: handRaisedStudents.length,
    participantCount: participants.length
  };

  return (
    <LiveSessionContext.Provider value={value}>
      {children}
    </LiveSessionContext.Provider>
  );
};

// Custom hook for easier consumption
export const useLiveSession = () => {
  const context = useContext(LiveSessionContext);
  if (!context) {
    throw new Error('useLiveSession must be used within a LiveSessionProvider');
  }
  return context;
};