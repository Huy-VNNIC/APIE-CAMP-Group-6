import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Button, 
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

// Mock data for active sessions
const mockSessions = [
  {
    id: 'session-abc123',
    title: 'JavaScript Fundamentals',
    instructorName: 'John Smith',
    participantCount: 3,
    startTime: new Date().toISOString(),
    hasPassword: true,
    password: 'demo123'
  },
  {
    id: 'session-def456',
    title: 'React Hooks Deep Dive',
    instructorName: 'Sarah Johnson',
    participantCount: 5,
    startTime: new Date(Date.now() - 30 * 60000).toISOString(),
    hasPassword: false
  }
];

const LiveSessionsList = () => {
  const [activeSessions] = useState(mockSessions);
  const [isConnecting, setIsConnecting] = useState(false);
  const [passwordPromptOpen, setPasswordPromptOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleJoinSession = async (sessionId) => {
    // Find the session
    const session = activeSessions.find(s => s.id === sessionId);
    
    if (!session) {
      setError('Session not found');
      return;
    }
    
    // Check if password is required
    if (session.hasPassword) {
      setCurrentSessionId(sessionId);
      setPasswordPromptOpen(true);
      return;
    }
    
    // Join session directly if no password
    joinSessionWithPassword(sessionId, '');
  };
  
  const joinSessionWithPassword = async (sessionId, password) => {
    try {
      setIsConnecting(true);
      
      // For demonstration purposes, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would validate against the server
      const session = activeSessions.find(s => s.id === sessionId);
      
      if (session.hasPassword && session.password !== password) {
        setError('Incorrect password');
        setIsConnecting(false);
        return;
      }
      
      // Store session info in localStorage for persistence
      localStorage.setItem('joinedSession', JSON.stringify({
        id: sessionId,
        password: password,
        joinedAt: new Date().toISOString()
      }));
      
      setIsConnecting(false);
      setPasswordPromptOpen(false);
      
      // Navigate to the live session page
      navigate(`/live-session/${sessionId}`);
    } catch (err) {
      setError('Failed to join session');
      setIsConnecting(false);
    }
  };
  
  const handlePasswordSubmit = () => {
    setError('');
    joinSessionWithPassword(currentSessionId, password);
  };
  
  const handleClosePasswordPrompt = () => {
    setPasswordPromptOpen(false);
    setPassword('');
    setCurrentSessionId('');
    setError('');
  };
  
  if (!activeSessions || activeSessions.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No active sessions found. Check back later or create your own!
        </Typography>
      </Paper>
    );
  }
  
  return (
    <>
      <Grid container spacing={3}>
        {activeSessions.map(session => (
          <Grid item xs={12} md={6} lg={4} key={session.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {session.title}
                {session.hasPassword && (
                  <LockIcon fontSize="small" color="action" sx={{ ml: 1, verticalAlign: 'middle' }} />
                )}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Instructor: {session.instructorName}
              </Typography>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip 
                  icon={<PersonIcon />} 
                  label={`${session.participantCount} ${session.participantCount === 1 ? 'participant' : 'participants'}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                
                <Typography variant="caption" color="text.secondary">
                  Started at {formatTime(session.startTime)}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleJoinSession(session.id)}
                disabled={isConnecting}
              >
                Join Session
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* Password prompt dialog */}
      <Dialog open={passwordPromptOpen} onClose={handleClosePasswordPrompt}>
        <DialogTitle>Password Required</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body1" paragraph>
            This session requires a password to join.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordPrompt}>Cancel</Button>
          <Button 
            onClick={handlePasswordSubmit} 
            variant="contained" 
            color="primary"
            disabled={isConnecting}
            startIcon={isConnecting ? <CircularProgress size={20} /> : null}
          >
            {isConnecting ? 'Joining...' : 'Join Session'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LiveSessionsList;
