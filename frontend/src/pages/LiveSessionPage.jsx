import React, { useState, useContext, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Badge,
  Alert,
  CircularProgress
} from '@mui/material';
import { LiveSessionContext } from '../contexts/LiveSessionContext';
import { UserContext } from '../contexts/UserContext';
import CodeEditor from '../components/CodeEditor';

// Icons
import SendIcon from '@mui/icons-material/Send';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';

const DRAWER_WIDTH = 320;

const LiveSessionPage = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const { 
    currentSession, 
    participants, 
    messages, 
    sharedCode, 
    codeExecutionResult,
    leaveSession,
    sendMessage,
    updateSharedCode,
    runCode,
    error,
    joinSession
  } = useContext(LiveSessionContext);
  const { user } = useContext(UserContext);
  
  const [newMessage, setNewMessage] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState('chat'); // 'chat' or 'participants'
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  
  // Try to join the session on page load
  useEffect(() => {
    const attemptJoinSession = async () => {
      if (!currentSession && sessionId) {
        try {
          await joinSession(sessionId);
          setLocalError(null);
        } catch (err) {
          console.error("Error joining session:", err);
          setLocalError(err.message || "Failed to join the session");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    attemptJoinSession();
  }, [currentSession, sessionId, joinSession]);
  
  // Auto-scroll chat on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const isInstructor = user?.role === 'instructor';
  const isSessionInstructor = isInstructor && currentSession?.instructorId === user?.id;
  
  // Handle message send
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };
  
  // Handle shared code update
  const handleCodeChange = (value) => {
    updateSharedCode(value);
  };
  
  // Handle code language change
  const handleLanguageChange = (e) => {
    updateSharedCode(sharedCode.code, e.target.value);
  };
  
  // Handle ending the session (instructor only)
  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this session?')) {
      leaveSession();
    }
  };
  
  // Format timestamp for messages
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading session...
        </Typography>
      </Box>
    );
  }
  
  if (error || localError) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || localError}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/live-sessions')}
          startIcon={<HomeIcon />}
        >
          Return to Live Sessions
        </Button>
      </Box>
    );
  }
  
  if (!currentSession) {
    return (
      <Box sx={{ textAlign: 'center', p: 5 }}>
        <Typography variant="h5" gutterBottom>
          Session not found or has ended
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The session you're trying to join may have ended or doesn't exist.
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/live-sessions')}
          startIcon={<HomeIcon />}
        >
          Return to Live Sessions
        </Button>
      </Box>
    );
  }
  
  const drawerContent = (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Button 
              color={activeDrawer === 'chat' ? 'secondary' : 'inherit'}
              onClick={() => setActiveDrawer('chat')}
              startIcon={<ChatIcon />}
            >
              Chat
            </Button>
            <Button 
              color={activeDrawer === 'participants' ? 'secondary' : 'inherit'}
              onClick={() => setActiveDrawer('participants')}
              startIcon={<PeopleIcon />}
            >
              People ({participants?.length || 0})
            </Button>
          </Box>
          <IconButton 
            color="inherit" 
            edge="end"
            onClick={() => setMobileDrawerOpen(false)}
            sx={{ display: { sm: 'none' } }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {activeDrawer === 'chat' ? (
        <>
          <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {messages && messages.length > 0 ? (
              messages.map((msg, index) => (
                <ListItem key={index} alignItems="flex-start" sx={{ p: 1 }}>
                  <ListItemAvatar>
                    <Avatar>
                      {(msg.fullName || msg.username) ? 
                        (msg.fullName || msg.username).charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box component="span">
                          {msg.fullName || msg.username}
                          {msg.role === 'instructor' && (
                            <Chip 
                              label="Instructor" 
                              size="small" 
                              color="primary" 
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(msg.timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={<Typography variant="body2">{msg.message}</Typography>}
                  />
                </ListItem>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No messages yet. Start the conversation!
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </List>
          
          <Divider />
          
          <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton 
                    color="primary" 
                    edge="end" 
                    type="submit"
                    disabled={!newMessage.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                )
              }}
            />
          </Box>
        </>
      ) : (
        <List>
          {participants && participants.length > 0 ? (
            participants.map((participant, index) => (
              <React.Fragment key={participant.id || index}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {(participant.fullName || participant.username) ? 
                        (participant.fullName || participant.username).charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={participant.fullName || participant.username}
                    secondary={participant.role === 'instructor' ? 'Instructor' : 'Student'}
                  />
                </ListItem>
                {index < participants.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No participants found.
              </Typography>
            </Box>
          )}
        </List>
      )}
    </>
  );
  
  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Session Header */}
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {currentSession.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Participants">
              <Badge 
                badgeContent={participants?.length || 0} 
                color="primary" 
                sx={{ mr: 1 }}
              >
                <IconButton
                  color="inherit"
                  onClick={() => {
                    setActiveDrawer('participants');
                    setMobileDrawerOpen(true);
                  }}
                >
                  <PeopleIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            
            <Tooltip title="Chat">
              <IconButton
                color="inherit"
                onClick={() => {
                  setActiveDrawer('chat');
                  setMobileDrawerOpen(true);
                }}
                sx={{ display: { sm: 'none' } }}
              >
                <ChatIcon />
              </IconButton>
            </Tooltip>
            
            {isSessionInstructor ? (
              <Button
                variant="contained"
                color="error"
                onClick={handleEndSession}
                startIcon={<ExitToAppIcon />}
              >
                End Session
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => leaveSession()}
                startIcon={<ExitToAppIcon />}
              >
                Leave
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {/* Editor Side */}
        <Grid item xs={12} sm={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: 1, borderColor: 'divider' }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={sharedCode?.language || 'javascript'}
                onChange={handleLanguageChange}
                label="Language"
                disabled={!isSessionInstructor}
              >
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="java">Java</MenuItem>
                <MenuItem value="csharp">C#</MenuItem>
                <MenuItem value="cpp">C++</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={runCode}
            >
              Run Code
            </Button>
            
            {!isSessionInstructor && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                Instructor controls the language selection
              </Typography>
            )}
          </Box>
          
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <CodeEditor
              code={sharedCode?.code || '// Start coding here\n'}
              language={sharedCode?.language || 'javascript'}
              onChange={handleCodeChange}
              readOnly={!isSessionInstructor}
            />
          </Box>
          
          {/* Code execution results */}
          {codeExecutionResult && (
            <Paper 
              sx={{ 
                p: 2, 
                m: 1, 
                maxHeight: 150, 
                overflow: 'auto',
                bgcolor: codeExecutionResult.success ? 'success.50' : 'error.50',
                border: 1,
                borderColor: codeExecutionResult.success ? 'success.main' : 'error.main'
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Execution Results:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {codeExecutionResult.output}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Execution time: {codeExecutionResult.executionTime}ms
              </Typography>
            </Paper>
          )}
        </Grid>
        
        {/* Chat/Participants Side - visible on desktop, drawer on mobile */}
        <Grid item sm={4} sx={{ display: { xs: 'none', sm: 'flex' }, height: '100%', borderLeft: 1, borderColor: 'divider' }}>
          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {drawerContent}
          </Box>
        </Grid>
        
        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          <Box sx={{ width: DRAWER_WIDTH, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {drawerContent}
          </Box>
        </Drawer>
      </Grid>
    </Box>
  );
};

export default LiveSessionPage;
