import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

import CreateSessionDialog from '../components/CreateSessionDialog';
import SessionShareDialog from '../components/SessionShareDialog';

// Sample course data
const courses = [
  { id: '1', title: 'JavaScript Fundamentals' },
  { id: '2', title: 'Python for Beginners' },
  { id: '3', title: 'Advanced React' },
  { id: '4', title: 'Node.js & Express' }
];

// Mock data for sessions
const initialSessions = [
  {
    id: 'session-abc123',
    title: 'JavaScript Fundamentals',
    courseId: '1',
    instructorName: 'John Smith',
    participantCount: 3,
    startTime: new Date().toISOString(),
    hasPassword: true,
    password: 'demo123'
  },
  {
    id: 'session-def456',
    title: 'React Hooks Deep Dive',
    courseId: '3',
    instructorName: 'Sarah Johnson',
    participantCount: 5,
    startTime: new Date(Date.now() - 30 * 60000).toISOString(),
    hasPassword: false
  }
];

const LiveSessionsPage = () => {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState(initialSessions);
  const [activeTab, setActiveTab] = useState(0);
  
  // For demo purposes, assume we're the instructor named "John Smith"
  const user = { 
    role: 'instructor', 
    username: 'instructor',
    fullName: 'John Smith' 
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleCreateSession = () => {
    setCreateDialogOpen(true);
  };
  
  const handleSessionCreated = (newSession) => {
    // Add the new session to our list
    setSessions([...sessions, {
      ...newSession,
      participantCount: 1,
      startTime: new Date().toISOString(),
      instructorName: user.fullName
    }]);
    
    setCreateDialogOpen(false);
    setSelectedSession(newSession);
    setShareDialogOpen(true);
  };
  
  const handleJoinSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      // Store the session info in localStorage
      localStorage.setItem('joinedSession', JSON.stringify({
        id: sessionId,
        password: session.password,
        joinedAt: new Date().toISOString()
      }));
      
      // Navigate to the session page
      navigate(`/live-session/${sessionId}`);
    }
  };
  
  // Format time display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Filter sessions relevant to the current user
  const userSessions = sessions.filter(
    session => user.role === 'instructor' ? 
      session.instructorName === user.fullName : 
      true
  );
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4" component="h1">
          Live Sessions
        </Typography>
        
        {user.role === 'instructor' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateSession}
          >
            Start New Session
          </Button>
        )}
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="All Sessions" />
          {user.role === 'instructor' && <Tab label="My Sessions" />}
        </Tabs>
      </Paper>
      
      {/* All Sessions Tab */}
      <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
        {sessions.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No active sessions found.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {sessions.map(session => (
              <Grid item xs={12} md={6} lg={4} key={session.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" noWrap>
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
                        label={`${session.participantCount} participants`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      
                      <Typography variant="caption" color="text.secondary">
                        Started at {formatTime(session.startTime)}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      variant="contained" 
                      color="primary"
                      fullWidth
                      onClick={() => handleJoinSession(session.id)}
                    >
                      Join Session
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      
      {/* My Sessions Tab (for instructors) */}
      {user.role === 'instructor' && (
        <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
          {userSessions.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                You haven't created any sessions yet. Click "Start New Session" to create one.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {userSessions.map(session => (
                <Grid item xs={12} md={6} lg={4} key={session.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" noWrap>
                        {session.title}
                        {session.hasPassword && (
                          <LockIcon fontSize="small" color="action" sx={{ ml: 1, verticalAlign: 'middle' }} />
                        )}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {courses.find(c => c.id === session.courseId)?.title || 'Unknown Course'}
                      </Typography>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          icon={<PersonIcon />}
                          label={`${session.participantCount} participants`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        
                        <Typography variant="caption" color="text.secondary">
                          Started at {formatTime(session.startTime)}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        fullWidth
                        onClick={() => handleJoinSession(session.id)}
                      >
                        Join Session
                      </Button>
                      
                      <Button 
                        variant="outlined"
                        onClick={() => {
                          setSelectedSession(session);
                          setShareDialogOpen(true);
                        }}
                      >
                        Share
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
      
      {/* Create Session Dialog */}
      <CreateSessionDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSessionCreated={handleSessionCreated}
        courses={courses}
      />
      
      {/* Share Session Dialog */}
      {selectedSession && (
        <SessionShareDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          sessionId={selectedSession.id}
          password={selectedSession.password}
          title={selectedSession.title}
        />
      )}
    </Box>
  );
};

export default LiveSessionsPage;
