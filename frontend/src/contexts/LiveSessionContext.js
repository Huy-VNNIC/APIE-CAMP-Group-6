import React, { createContext, useState, useEffect, useCallback } from 'react';

// Create context
export const LiveSessionContext = createContext();

// Provider component
export const LiveSessionProvider = ({ children }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  
  // Create a new session
  const createSession = async (sessionData) => {
    setIsCreating(true);
    setError(null);
    
    try {
      // In a real app, this would make an API call
      // For demo, we'll simulate a successful response
      const sessionId = sessionData.sessionId || `session-${Date.now().toString(36)}`;
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSession = {
        id: sessionId,
        title: sessionData.title,
        courseId: sessionData.courseId,
        description: sessionData.description,
        instructorId: 'user-123', // Current user ID
        instructorName: sessionData.instructorName || 'Instructor',
        password: sessionData.password,
        participantCount: 1,
        startTime: new Date().toISOString(),
        hasPassword: !!sessionData.password
      };
      
      // Add to active sessions
      setActiveSessions(prev => [...prev, newSession]);
      setCurrentSession(newSession);
      
      // Store in localStorage for persistence
      localStorage.setItem('currentSession', JSON.stringify(newSession));
      
      setIsCreating(false);
      return { 
        success: true, 
        session: newSession 
      };
    } catch (err) {
      setError('Failed to create session');
      setIsCreating(false);
      throw err;
    }
  };
  
  // Join an existing session
  const joinSession = async (sessionId, password) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // In a real app, this would make an API call
      // For demo, we'll simulate various responses
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the session in active sessions
      const session = activeSessions.find(s => s.id === sessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      // Check password if required
      if (session.hasPassword && session.password !== password) {
        setIsConnecting(false);
        return { passwordRequired: true };
      }
      
      // Join the session
      setCurrentSession({
        ...session,
        participantCount: session.participantCount + 1
      });
      
      // Store in localStorage for persistence
      localStorage.setItem('currentSession', JSON.stringify(session));
      
      setIsConnecting(false);
      return { success: true, session };
    } catch (err) {
      setError(err.message || 'Failed to join session');
      setIsConnecting(false);
      throw err;
    }
  };
  
  // Initialize with mock data
  useEffect(() => {
    // Mock active sessions for demo
    const mockSessions = [
      {
        id: 'session-abc123',
        title: 'JavaScript Fundamentals',
        courseId: '1',
        instructorId: 'instructor-1',
        instructorName: 'John Smith',
        password: 'demo123',
        participantCount: 3,
        startTime: new Date().toISOString(),
        hasPassword: true
      },
      {
        id: 'session-def456',
        title: 'React Hooks Deep Dive',
        courseId: '3',
        instructorId: 'instructor-2',
        instructorName: 'Sarah Johnson',
        password: null,
        participantCount: 5,
        startTime: new Date(Date.now() - 30 * 60000).toISOString(),
        hasPassword: false
      }
    ];
    
    setActiveSessions(mockSessions);
    
    // Check for saved session
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      try {
        setCurrentSession(JSON.parse(savedSession));
      } catch (err) {
        localStorage.removeItem('currentSession');
      }
    }
  }, []);
  
  // Context value
  const value = {
    isConnecting,
    isCreating,
    error,
    activeSessions,
    currentSession,
    createSession,
    joinSession,
    setCurrentSession
  };
  
  return (
    <LiveSessionContext.Provider value={value}>
      {children}
    </LiveSessionContext.Provider>
  );
};
