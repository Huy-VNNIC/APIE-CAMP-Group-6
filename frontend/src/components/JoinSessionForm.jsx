import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const JoinSessionForm = () => {
  const [sessionId, setSessionId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
  
  // Parse URL query parameters on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    const passwordParam = urlParams.get('password');
    
    if (sessionParam) {
      setSessionId(sessionParam);
      if (passwordParam) {
        setPassword(passwordParam);
        setPasswordRequired(true);
      }
    }
  }, []);
  
  const handleJoinSession = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!sessionId.trim()) {
      setLocalError('Please enter a Session ID');
      return;
    }
    
    try {
      setIsConnecting(true);
      
      // For demonstration purposes, we'll just simulate success
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If password is required but not provided
      if (passwordRequired && !password) {
        setLocalError('This session requires a password');
        setIsConnecting(false);
        return;
      }
      
      // Simulate successful join
      // Store session info in localStorage for persistence
      localStorage.setItem('joinedSession', JSON.stringify({
        id: sessionId,
        password: password,
        joinedAt: new Date().toISOString()
      }));
      
      setIsConnecting(false);
      
      // Navigate to the live session page
      navigate(`/live-session/${sessionId}`);
    } catch (err) {
      setLocalError('Failed to join session');
      setIsConnecting(false);
    }
  };
  
  // Paste from clipboard helper
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      
      // Extract session ID from text
      const sessionMatch = clipboardText.match(/Session ID: ([a-zA-Z0-9_-]+)/i);
      if (sessionMatch && sessionMatch[1]) {
        setSessionId(sessionMatch[1]);
      }
      
      // Extract password from text if present
      const passwordMatch = clipboardText.match(/Password: ([a-zA-Z0-9_-]+)/i);
      if (passwordMatch && passwordMatch[1]) {
        setPassword(passwordMatch[1]);
        setPasswordRequired(true);
      }
    } catch (err) {
      console.error('Failed to read from clipboard:', err);
    }
  };
  
  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom align="center">
        Join a Live Session
      </Typography>
      
      {localError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleJoinSession}>
        <TextField
          label="Session ID"
          fullWidth
          margin="normal"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          required
          placeholder="Enter the session ID provided by your instructor"
        />
        
        <TextField
          label="Password (if required)"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter the session password if needed"
        />
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handlePasteFromClipboard}
            disabled={isConnecting}
          >
            Paste from Clipboard
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isConnecting || !sessionId.trim()}
            startIcon={isConnecting ? <CircularProgress size={20} /> : null}
          >
            {isConnecting ? 'Joining...' : 'Join Session'}
          </Button>
        </Box>
      </Box>
      
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
        Need help? Ask your instructor for the session ID and password.
      </Typography>
    </Paper>
  );
};

export default JoinSessionForm;
