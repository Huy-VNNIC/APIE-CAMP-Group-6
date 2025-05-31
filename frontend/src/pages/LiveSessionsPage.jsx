import React, { useState, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Grid,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import { UserContext } from '../contexts/UserContext';
import LiveSessionsList from '../components/LiveSessionsList';
import CreateSessionDialog from '../components/CreateSessionDialog';

// Icons
import VideocamIcon from '@mui/icons-material/Videocam';
import HistoryIcon from '@mui/icons-material/History';

// Sample course data
const courses = [
  { id: '1', title: 'JavaScript Fundamentals' },
  { id: '2', title: 'Python for Beginners' },
  { id: '3', title: 'Advanced React' },
  { id: '4', title: 'Node.js & Express' }
];

// Sample past sessions
const pastSessions = [
  {
    id: "1",
    title: "JavaScript Event Loop Deep Dive",
    instructorName: "John Smith",
    courseName: "JavaScript Fundamentals",
    startTime: "2023-05-15T14:00:00Z",
    endTime: "2023-05-15T15:30:00Z",
    participantCount: 24,
    recordingUrl: "https://example.com/recordings/js-event-loop"
  },
  {
    id: "2",
    title: "Building React Hooks from Scratch",
    instructorName: "John Smith",
    courseName: "Advanced React",
    startTime: "2023-05-18T13:00:00Z",
    endTime: "2023-05-18T14:15:00Z",
    participantCount: 18,
    recordingUrl: "https://example.com/recordings/react-hooks"
  }
];

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time for display
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const LiveSessionsPage = () => {
  const { user } = useContext(UserContext);
  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  const isInstructor = user?.role === 'instructor';
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4" component="h1">
          Live Sessions
        </Typography>
        
        {isInstructor && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<VideocamIcon />}
            onClick={() => setCreateSessionOpen(true)}
          >
            Start New Session
          </Button>
        )}
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="session tabs">
          <Tab icon={<VideocamIcon />} iconPosition="start" label="Active Sessions" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="Past Sessions" />
        </Tabs>
      </Paper>
      
      <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
        <LiveSessionsList />
      </Box>
      
      <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
        {pastSessions.length > 0 ? (
          <Grid container spacing={3}>
            {pastSessions.map(session => (
              <Grid item xs={12} md={6} lg={4} key={session.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {session.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Instructor: {session.instructorName}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Course: {session.courseName}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      Date: {formatDate(session.startTime)}
                    </Typography>
                    <Typography variant="body2">
                      Time: {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" gutterBottom>
                    Participants: {session.participantCount}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      disabled={!session.recordingUrl}
                    >
                      {session.recordingUrl ? 'View Recording' : 'No Recording Available'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No past sessions found.
            </Typography>
          </Paper>
        )}
      </Box>
      
      <CreateSessionDialog
        open={createSessionOpen}
        onClose={() => setCreateSessionOpen(false)}
        courses={courses}
      />
    </Box>
  );
};

export default LiveSessionsPage;
