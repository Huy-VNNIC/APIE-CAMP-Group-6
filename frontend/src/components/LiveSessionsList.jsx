import React, { useContext, useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Chip, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { LiveSessionContext } from '../contexts/LiveSessionContext';
import { UserContext } from '../contexts/UserContext';

// Icons
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const LiveSessionsList = () => {
  const { activeSessions, joinSession, isConnecting, error } = useContext(LiveSessionContext);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch active sessions here
    // For now, we'll just simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleJoinSession = (sessionId) => {
    joinSession(sessionId)
      .catch(err => console.error("Failed to join session:", err));
  };

  const formatDuration = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000 / 60); // minutes
    
    if (diff < 60) {
      return `${diff}m`;
    } else {
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return `${hours}h ${mins}m`;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (activeSessions.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No live sessions are currently active. 
          {user?.role === 'instructor' && " Click 'Start New Session' to create one."}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mb: 3 }}>
      <List>
        {activeSessions.map((session, index) => (
          <React.Fragment key={session.id}>
            {index > 0 && <Divider />}
            <ListItem
              sx={{ py: 2 }}
              secondaryAction={
                isConnecting ? (
                  <CircularProgress size={24} />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleJoinSession(session.id)}
                    startIcon={<VideocamIcon />}
                    disabled={isConnecting}
                  >
                    Join Session
                  </Button>
                )
              }
            >
              <ListItemText
                primary={
                  <Typography variant="h6" component="div">
                    {session.title}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Instructor: {session.instructorName}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                      <Chip 
                        icon={<PersonIcon fontSize="small" />} 
                        label={`${session.participantCount} participants`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      
                      <Chip
                        icon={<AccessTimeIcon fontSize="small" />}
                        label={`Started ${formatDuration(session.startTime)} ago`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default LiveSessionsList;
