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
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Badge,
  Tooltip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import CodeEditor from '../components/CodeEditor';
import SessionChat from '../components/SessionChat';

// Icons
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CodeIcon from '@mui/icons-material/Code';
import ChatIcon from '@mui/icons-material/Chat';
import HelpIcon from '@mui/icons-material/Help';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import PanToolIcon from '@mui/icons-material/PanTool';

const InstructorLiveSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [isSharing, setIsSharing] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [raiseHandCount, setRaiseHandCount] = useState(2);
  const [confirmEndDialog, setConfirmEndDialog] = useState(false);
  
  const drawerWidth = 320;
  
  useEffect(() => {
    // In a real app, you would fetch the session data from the server
    // For this demo, we'll simulate loading the session
    const loadSession = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock session based on the ID
      setSession({
        id: id,
        title: `JavaScript Functions Workshop`,
        courseId: '1',
        instructorName: 'John Smith',
        participantCount: 5,
        startTime: new Date().toISOString(),
        description: 'Learn about JavaScript functions, arrow functions, and function scope'
      });
      
      setIsLoading(false);
    };
    
    loadSession();
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleLeaveSession = () => {
    navigate('/live-sessions');
  };
  
  const handleEndSession = () => {
    setConfirmEndDialog(false);
    // Simulate ending the session
    alert('Session ended. All participants have been disconnected.');
    navigate('/live-sessions');
  };
  
  const toggleScreenShare = () => {
    setIsSharing(!isSharing);
  };
  
  const toggleMicrophone = () => {
    setIsMicrophoneOn(!isMicrophoneOn);
  };
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };
  
  // Instructor controls panel
  const instructorControls = (
    <Box sx={{ width: drawerWidth, height: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2
      }}>
        <Typography variant="h6" noWrap>
          Instructor Controls
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Session Status
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 2 
        }}>
          <Typography variant="body2" color="text.secondary">
            Duration: 45:30
          </Typography>
          <Chip 
            label={`${session?.participantCount || 0} participants`} 
            color="primary" 
            size="small"
          />
        </Box>
        
        <Tooltip title="Student questions & hand raises">
          <Badge badgeContent={raiseHandCount} color="error">
            <Button 
              variant="outlined" 
              fullWidth 
              color="warning" 
              startIcon={<PanToolIcon />}
              sx={{ mb: 2 }}
            >
              View Hand Raises
            </Button>
          </Badge>
        </Tooltip>
        
        <Typography variant="subtitle1" gutterBottom>
          Sharing Controls
        </Typography>
        
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Button 
              variant={isSharing ? "contained" : "outlined"}
              fullWidth
              color={isSharing ? "success" : "primary"}
              startIcon={isSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              onClick={toggleScreenShare}
            >
              {isSharing ? "Stop" : "Share"}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              variant={isVideoOn ? "contained" : "outlined"}
              fullWidth
              color={isVideoOn ? "success" : "primary"}
              startIcon={<VideoCallIcon />}
              onClick={toggleVideo}
            >
              {isVideoOn ? "On" : "Video"}
            </Button>
          </Grid>
        </Grid>
        
        <Grid container spacing={1} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Button 
              variant={isMicrophoneOn ? "contained" : "outlined"}
              fullWidth
              color={isMicrophoneOn ? "success" : "primary"}
              startIcon={isMicrophoneOn ? <MicIcon /> : <MicOffIcon />}
              onClick={toggleMicrophone}
            >
              {isMicrophoneOn ? "Mic On" : "Mic Off"}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              variant="outlined"
              fullWidth
              color="primary"
              startIcon={<PersonIcon />}
            >
              Participants
            </Button>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Session Control
        </Typography>
        
        <Button 
          variant="contained" 
          color="error" 
          fullWidth
          onClick={() => setConfirmEndDialog(true)}
          sx={{ mb: 1 }}
        >
          End Session
        </Button>
        
        <Typography variant="caption" color="text.secondary">
          Ending the session will disconnect all participants and save the recording.
        </Typography>
      </Box>
    </Box>
  );
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading session...
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
            The session you're trying to access doesn't exist or has ended.
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
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginRight: { md: drawerOpen ? `${drawerWidth}px` : 0 },
          height: '100%',
          overflow: 'auto'
        }}
      >
        <AppBar position="static" color="default" elevation={1} sx={{ mb: 2 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {session.title} (Instructor View)
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Recording active">
                <Badge color="error" variant="dot" sx={{ mr: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    LIVE
                  </Typography>
                </Badge>
              </Tooltip>
              
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<ExitToAppIcon />}
                onClick={handleLeaveSession}
                size="small"
              >
                Leave
              </Button>
            </Box>
            
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        
        <Paper sx={{ mb: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<CodeIcon />} iconPosition="start" label="Code Editor" />
            <Tab 
              icon={<ChatIcon />} 
              iconPosition="start" 
              label="Chat" 
              iconPosition="start"
            />
            <Tab icon={<HelpIcon />} iconPosition="start" label="Help & Resources" />
            <Tab icon={<AssignmentIcon />} iconPosition="start" label="Assignments" />
          </Tabs>
        </Paper>
        
        {/* Code Editor Tab */}
        <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant={isSharing ? "contained" : "outlined"}
              color={isSharing ? "success" : "primary"}
              startIcon={isSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              onClick={toggleScreenShare}
            >
              {isSharing ? "Stop Sharing Code" : "Share Code with Students"}
            </Button>
          </Box>
          
          <CodeEditor readOnly={false} />
        </Box>
        
        {/* Chat Tab */}
        <Box sx={{ 
          display: activeTab === 1 ? 'block' : 'none',
          height: 'calc(100vh - 230px)'
        }}>
          <SessionChat />
        </Box>
        
        {/* Help & Resources Tab */}
        <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Help & Resources
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Session Resources
            </Typography>
            
            <Typography variant="body1" paragraph>
              Share these resources with your students:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
              <Button variant="outlined" startIcon={<AssignmentIcon />}>
                JavaScript Functions Cheat Sheet (PDF)
              </Button>
              <Button variant="outlined" startIcon={<AssignmentIcon />}>
                Code Examples (ZIP)
              </Button>
              <Button variant="outlined" startIcon={<AssignmentIcon />}>
                Exercise Problems (PDF)
              </Button>
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Add Resources
            </Typography>
            
            <Button variant="contained" color="primary">
              Upload New Resource
            </Button>
          </Paper>
        </Box>
        
        {/* Assignments Tab */}
        <Box sx={{ display: activeTab === 3 ? 'block' : 'none' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Assignments
            </Typography>
            
            <Typography variant="body1" paragraph>
              Manage assignments for this session:
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Assignment 1: Function Basics
              </Typography>
              
              <Typography variant="body1" paragraph>
                Create three different functions to demonstrate your understanding of regular functions, arrow functions, and function expressions.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary">
                  Edit Assignment
                </Button>
                
                <Button variant="outlined">
                  View Submissions (0)
                </Button>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Typography variant="h6" gutterBottom>
                Assignment 2: Function Scope and Closures
              </Typography>
              
              <Typography variant="body1" paragraph>
                Create examples demonstrating function scope, closures, and the module pattern.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary">
                  Edit Assignment
                </Button>
                
                <Button variant="outlined">
                  View Submissions (0)
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Button variant="contained" color="primary">
                Create New Assignment
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
      
      {/* Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {instructorControls}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          anchor="right"
          open={drawerOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {instructorControls}
        </Drawer>
      )}
      
      {/* End Session Confirmation Dialog */}
      <Dialog
        open={confirmEndDialog}
        onClose={() => setConfirmEndDialog(false)}
      >
        <DialogTitle>End Session</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end this session? All participants will be disconnected, and the session will be marked as completed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmEndDialog(false)}>Cancel</Button>
          <Button onClick={handleEndSession} variant="contained" color="error">
            End Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstructorLiveSession;
