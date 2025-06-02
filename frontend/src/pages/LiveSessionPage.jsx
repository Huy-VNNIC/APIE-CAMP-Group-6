import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  TextField,
  IconButton,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ButtonGroup
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

// Icons
import SendIcon from '@mui/icons-material/Send';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';

const LiveSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [code, setCode] = useState('// Start coding here...');
  const [output, setOutput] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch the session data from the server
    const loadSession = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the joined session from localStorage
      const joinedSession = localStorage.getItem('joinedSession');
      
      if (joinedSession) {
        try {
          const sessionData = JSON.parse(joinedSession);
          
          // For demonstration, determine if the user is an instructor
          // In a real app, this would be based on user role from authentication
          setIsInstructor(sessionData.role === 'instructor');
          
          // For demo purposes, create a mock session based on the ID
          setSession({
            id: id,
            title: `JavaScript Functions Workshop`,
            instructorName: 'John Smith',
            participantCount: 5,
            startTime: new Date().toISOString()
          });
          
          // Initialize with sample messages
          setMessages([
            {
              id: 1,
              sender: 'John Smith',
              text: 'Welcome to the live session! Feel free to ask questions.',
              timestamp: new Date(Date.now() - 5 * 60000).toISOString()
            }
          ]);
          
          setIsLoading(false);
        } catch (error) {
          console.error("Error parsing joined session:", error);
          navigate('/live-sessions');
        }
      } else {
        // No saved session, redirect to live sessions page
        navigate('/live-sessions');
      }
    };
    
    loadSession();
  }, [id, navigate]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleRunCode = () => {
    // In a real app, this would send the code to the server for execution
    // For demo purposes, we'll just simulate an output
    setOutput(`Running your code...\n\n> console.log("Hello, world!");\nHello, world!\n\nExecution completed successfully.`);
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add the message to the list
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'You',
        text: message,
        timestamp: new Date().toISOString()
      }
    ]);
    
    // Clear the input
    setMessage('');
  };
  
  const handleLeaveSession = () => {
    // In a real app, you would notify the server that the user is leaving
    // For demo purposes, we'll just clear local storage and navigate away
    localStorage.removeItem('joinedSession');
    navigate('/live-sessions');
  };
  
  const handleToggleSharing = () => {
    setIsSharing(!isSharing);
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Joining session...
        </Typography>
      </Box>
    );
  }
  
  if (!session) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Session Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The session you're trying to join doesn't exist or has ended.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/live-sessions')}
          >
            Back to Live Sessions
          </Button>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            {session.title} {isInstructor && "(Instructor View)"}
          </Typography>
          
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<ExitToAppIcon />}
            onClick={handleLeaveSession}
          >
            Leave Session
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Instructor: {session.instructorName}
        </Typography>
      </Paper>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Code Editor" />
          <Tab label="Chat" />
        </Tabs>
      </Paper>
      
      {/* Code Editor Tab */}
      <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
        {isInstructor && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant={isSharing ? "contained" : "outlined"}
              color={isSharing ? "success" : "primary"}
              startIcon={isSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              onClick={handleToggleSharing}
            >
              {isSharing ? "Stop Sharing Code" : "Share Code with Students"}
            </Button>
          </Box>
        )}
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {isInstructor ? 'Code Editor' : 'Shared Code'}
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={15}
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={!isInstructor}
                sx={{ fontFamily: 'monospace' }}
              />
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleRunCode}
                  startIcon={<PlayArrowIcon />}
                  disabled={!isInstructor}
                >
                  Run Code
                </Button>
              </Box>
            </Paper>
            
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Output
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                bgcolor: 'black', 
                color: 'white', 
                borderRadius: 1,
                fontFamily: 'monospace',
                height: '200px',
                overflow: 'auto'
              }}>
                <pre>{output || 'Run your code to see output here'}</pre>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Session Info
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                <strong>Session ID:</strong> {session.id}
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Participants:</strong> {session.participantCount}
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Started:</strong> {new Date(session.startTime).toLocaleString()}
              </Typography>
              
              {isInstructor && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Instructor Controls
                  </Typography>
                  <ButtonGroup variant="outlined" fullWidth>
                    <Button 
                      color={isSharing ? "success" : "primary"}
                      onClick={handleToggleSharing}
                    >
                      {isSharing ? "Stop Sharing" : "Share Code"}
                    </Button>
                    <Button color="error">
                      End Session
                    </Button>
                  </ButtonGroup>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Chat Tab */}
      <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
        <Paper sx={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
            <List>
              {messages.map((msg) => (
                <ListItem key={msg.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      {msg.sender.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">
                          {msg.sender}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    }
                    secondary={msg.text}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              size="small"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <IconButton 
              color="primary"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              sx={{ ml: 1 }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LiveSessionPage;
