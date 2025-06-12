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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ButtonGroup,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  FormGroup,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  DialogContentText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

// Icons
import SendIcon from '@mui/icons-material/Send';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import PanToolIcon from '@mui/icons-material/PanTool';
import NoteIcon from '@mui/icons-material/Note';
import SaveIcon from '@mui/icons-material/Save';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import BlockIcon from '@mui/icons-material/Block';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TimerIcon from '@mui/icons-material/Timer';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VideocamIcon from '@mui/icons-material/Videocam';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ForumIcon from '@mui/icons-material/Forum';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AssignmentIcon from '@mui/icons-material/Assignment'; // Missing import added

const LiveSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Current state
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [code, setCode] = useState('// Start coding here...');
  const [output, setOutput] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isInstructor, setIsInstructor] = useState(true); // Force instructor mode
  const [isSharing, setIsSharing] = useState(false);
  
  // New instructor features
  const [isRecording, setIsRecording] = useState(false);
  const [pollActive, setPollActive] = useState(false);
  const [codeVisibility, setCodeVisibility] = useState('all');
  const [sessionMode, setSessionMode] = useState('lecture');
  const [breakoutRooms, setBreakoutRooms] = useState([]);
  const [showBreakoutDialog, setShowBreakoutDialog] = useState(false);
  const [attendanceTracking, setAttendanceTracking] = useState(false);
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [runSpeed, setRunSpeed] = useState('normal');
  const [focusMode, setFocusMode] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [confirmEndDialog, setConfirmEndDialog] = useState(false);
  const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  
  // Mock participants list
  const [participantsList, setParticipantsList] = useState([
    { id: 1, name: 'John Smith', role: 'instructor', avatar: 'JS', status: 'online' },
    { id: 2, name: 'Alex Johnson', role: 'student', avatar: 'AJ', status: 'online' },
    { id: 3, name: 'Emma Wilson', role: 'student', avatar: 'EW', status: 'online' },
    { id: 4, name: 'Michael Brown', role: 'student', avatar: 'MB', status: 'online', handRaised: true },
    { id: 5, name: 'Sarah Davis', role: 'student', avatar: 'SD', status: 'online', handRaised: true }
  ]);
  
  // Code examples
  const [codeExamples, setCodeExamples] = useState([
    { id: 1, title: "Basic Functions", code: "// Function example\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('Student'));" },
    { id: 2, title: "Arrow Functions", code: "// Arrow function example\nconst multiply = (a, b) => a * b;\n\nconsole.log(multiply(5, 3));" },
    { id: 3, title: "Callback Functions", code: "// Callback example\nfunction processData(data, callback) {\n  // Process data\n  const result = `Processed: ${data}`;\n  callback(result);\n}\n\nprocessData('test data', (result) => {\n  console.log(result);\n});" }
  ]);
  
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
          setIsInstructor(sessionData.role === 'instructor' || true); // Force instructor mode for this page
          
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
            },
            {
              id: 2,
              sender: 'Alex Johnson',
              text: 'I have a question about function parameters.',
              timestamp: new Date(Date.now() - 3 * 60000).toISOString()
            }
          ]);
          
          setIsLoading(false);
        } catch (error) {
          console.error("Error parsing joined session:", error);
          navigate('/live-sessions');
        }
      } else {
        // Create demo session data for testing
        localStorage.setItem('joinedSession', JSON.stringify({
          id: id || 'session-abc123',
          role: 'instructor',
          joinedAt: new Date().toISOString()
        }));
        
        setSession({
          id: id || 'session-abc123',
          title: `JavaScript Functions Workshop`,
          instructorName: 'John Smith',
          participantCount: 5,
          startTime: new Date().toISOString()
        });
        
        setMessages([
          {
            id: 1,
            sender: 'John Smith',
            text: 'Welcome to the live session! Feel free to ask questions.',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString()
          }
        ]);
        
        setIsLoading(false);
      }
    };
    
    loadSession();
  }, [id, navigate]);
  
  // Current handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleRunCode = () => {
    setOutput(`Running code at ${runSpeed} speed...\n\n> console.log("Hello, world!");\nHello, world!\n\nExecution completed successfully.`);
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add the message to the list
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'You (Instructor)',
        text: message,
        timestamp: new Date().toISOString()
      }
    ]);
    
    // Clear the input
    setMessage('');
  };
  
  const handleLeaveSession = () => {
    navigate('/live-sessions');
  };
  
  const handleToggleSharing = () => {
    setIsSharing(!isSharing);
    showAlert(isSharing ? 'Code sharing stopped' : 'Code sharing started', 'info');
  };
  
  const showAlert = (message, severity) => {
    // Implementation would vary based on your alert/notification system
    console.log(`${severity.toUpperCase()}: ${message}`);
    // For real implementation:
    // setSnackbarMessage(message);
    // setSnackbarSeverity(severity);
    // setShowSnackbar(true);
  };
  
  const toggleMicrophone = () => {
    setIsMicrophoneOn(!isMicrophoneOn);
    showAlert(isMicrophoneOn ? 'Microphone muted' : 'Microphone activated', 'info');
  };
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    showAlert(isVideoOn ? 'Camera turned off' : 'Camera activated', 'info');
  };
  
  const handleEndSession = () => {
    setConfirmEndDialog(false);
    showAlert('Session ended successfully', 'success');
    navigate('/live-sessions');
  };

  // Rendering
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
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            {session.title} {isInstructor && "(Instructor View)"}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {isRecording && (
              <Badge 
                color="error" 
                variant="dot" 
                sx={{ mr: 1 }}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'left',
                }}
              >
                <Typography variant="body2" sx={{ mr: 2, fontWeight: 'bold' }}>
                  RECORDING
                </Typography>
              </Badge>
            )}
            
            {/* Microphone control */}
            <Tooltip title={isMicrophoneOn ? "Mute microphone" : "Unmute microphone"}>
              <IconButton 
                color={isMicrophoneOn ? "primary" : "default"} 
                onClick={toggleMicrophone}
              >
                {isMicrophoneOn ? <MicIcon /> : <MicOffIcon />}
              </IconButton>
            </Tooltip>
            
            {/* Video control */}
            <Tooltip title={isVideoOn ? "Turn off camera" : "Turn on camera"}>
              <IconButton 
                color={isVideoOn ? "primary" : "default"} 
                onClick={toggleVideo}
              >
                <VideocamIcon />
              </IconButton>
            </Tooltip>
            
            {/* Button to display participant list */}
            <Tooltip title="Participants">
              <Button 
                variant="outlined"
                onClick={() => setShowParticipantsDialog(true)}
                startIcon={<PeopleIcon />}
              >
                {session.participantCount}
              </Button>
            </Tooltip>

            {/* Settings button */}
            <Tooltip title="Session settings">
              <IconButton onClick={() => setShowSettingsDialog(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            {/* Leave session button */}
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<ExitToAppIcon />}
              onClick={handleLeaveSession}
            >
              Leave
            </Button>
            
            {/* End session button (Instructor only) */}
            <Button 
              variant="contained" 
              color="error"
              onClick={() => setConfirmEndDialog(true)}
            >
              End Session
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Instructor: {session.instructorName}
        </Typography>
      </Paper>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Code Editor" />
          <Tab label="Chat" />
          <Tab label="Resources" />
        </Tabs>
      </Paper>
      
      {/* Code Editor Tab */}
      <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant={isSharing ? "contained" : "outlined"}
            color={isSharing ? "success" : "primary"}
            startIcon={isSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            onClick={handleToggleSharing}
          >
            {isSharing ? "Stop Sharing Code" : "Share Code with Students"}
          </Button>
          
          <Box>
            <FormControl sx={{ minWidth: 160, mr: 2 }} size="small">
              <InputLabel>Code Visibility</InputLabel>
              <Select
                value={codeVisibility}
                onChange={(e) => {
                  setCodeVisibility(e.target.value);
                  showAlert(`Code visibility set to: ${e.target.value}`, 'info');
                }}
                label="Code Visibility"
              >
                <MenuItem value="all">All Students</MenuItem>
                <MenuItem value="groups">Selected Groups</MenuItem>
                <MenuItem value="individual">Individual Students</MenuItem>
                <MenuItem value="readonly">Read Only Mode</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              color={sessionMode === 'focus' ? "secondary" : "primary"}
              startIcon={<VisibilityIcon />}
              onClick={() => {
                setSessionMode(sessionMode === 'focus' ? 'lecture' : 'focus');
                showAlert(
                  sessionMode === 'focus' 
                    ? 'Focus mode disabled' 
                    : 'Focus mode enabled - All student screens will show only your code',
                  'info'
                );
              }}
            >
              {sessionMode === 'focus' ? "Disable Focus Mode" : "Enable Focus Mode"}
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Code Editor
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={15}
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{ fontFamily: 'monospace' }}
              />
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <FormControl sx={{ minWidth: 140 }} size="small">
                  <InputLabel>Code Run Speed</InputLabel>
                  <Select
                    value={runSpeed}
                    onChange={(e) => {
                      setRunSpeed(e.target.value);
                      showAlert(`Code execution speed set to: ${e.target.value}`, 'info');
                    }}
                    label="Code Run Speed"
                  >
                    <MenuItem value="slow">Slow (Demo)</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="fast">Fast</MenuItem>
                  </Select>
                </FormControl>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleRunCode}
                  startIcon={<PlayArrowIcon />}
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
                <pre>{output || 'Run code to see output here'}</pre>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, mb: 3 }}>
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
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Quick Actions
              </Typography>
              
              <ButtonGroup variant="outlined" fullWidth sx={{ mb: 1 }}>
                <Button
                  startIcon={<RadioButtonCheckedIcon />}
                  color={isRecording ? "error" : "primary"}
                  onClick={() => {
                    setIsRecording(!isRecording);
                    showAlert(
                      isRecording ? 'Recording stopped' : 'Session recording started',
                      isRecording ? 'info' : 'success'
                    );
                  }}
                >
                  {isRecording ? "Stop Rec." : "Record"}
                </Button>
                <Button
                  startIcon={<TimerIcon />}
                  onClick={() => {
                    showAlert('Timer started: 5 minutes', 'info');
                  }}
                >
                  Timer
                </Button>
              </ButtonGroup>
              
              <ButtonGroup variant="outlined" fullWidth>
                <Button 
                  startIcon={<QuizIcon />} 
                  onClick={() => setShowQuizDialog(true)}
                >
                  Quiz
                </Button>
                <Button 
                  startIcon={<ThumbsUpDownIcon />} 
                  color={pollActive ? "success" : "primary"}
                  onClick={() => {
                    if (!pollActive) {
                      setShowPollDialog(true);
                    } else {
                      setPollActive(false);
                      showAlert('Poll ended', 'info');
                    }
                  }}
                >
                  {pollActive ? "End Poll" : "Poll"}
                </Button>
              </ButtonGroup>
            </Paper>
            
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">
                  Student Assistance
                </Typography>
                <Chip 
                  icon={<PanToolIcon />}
                  label="2"
                  color="secondary"
                  size="small"
                />
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                {participantsList.filter(p => p.handRaised).map((participant) => (
                  <ListItem 
                    key={participant.id}
                    secondaryAction={
                      <Button size="small" variant="outlined">
                        Help
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 24, height: 24, fontSize: '0.75rem' }}>
                        {participant.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={participant.name} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
              
              {participantsList.filter(p => p.handRaised).length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                  No students have questions at the moment.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
        
        {/* Instructor Advanced Controls (when in instructor mode) */}
        {isInstructor && (
          <>
            <Paper sx={{ p: 2, my: 3 }}>
              <Typography variant="h6" gutterBottom>
                Instructor Controls
              </Typography>
              
              <Grid container spacing={2}>
                {/* Classroom Management Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                    <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Classroom Management
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<PeopleIcon />} 
                      onClick={() => setShowParticipantsDialog(true)}
                      size="small"
                    >
                      View Students ({participantsList.length})
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      color={attendanceTracking ? "success" : "primary"}
                      startIcon={<CheckCircleIcon />} 
                      onClick={() => {
                        setAttendanceTracking(!attendanceTracking);
                        showAlert(
                          attendanceTracking ? 'Attendance tracking disabled' : 'Attendance tracking enabled',
                          'info'
                        );
                      }}
                      size="small"
                    >
                      {attendanceTracking ? "Tracking Attendance" : "Track Attendance"}
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      color="warning"
                      startIcon={<BlockIcon />} 
                      onClick={() => {
                        // Show dialog for muting students
                        showAlert('All student inputs have been temporarily disabled', 'warning');
                      }}
                      size="small"
                    >
                      Mute All Inputs
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      color={sessionMode === 'focus' ? "secondary" : "primary"}
                      startIcon={<VisibilityIcon />} 
                      onClick={() => {
                        setSessionMode(sessionMode === 'focus' ? 'lecture' : 'focus');
                        showAlert(
                          sessionMode === 'focus' 
                            ? 'Focus mode disabled' 
                            : 'Focus mode enabled - All student screens will show only your code',
                          'info'
                        );
                      }}
                      size="small"
                    >
                      {sessionMode === 'focus' ? "Disable Focus Mode" : "Enable Focus Mode"}
                    </Button>
                  </Box>
                </Grid>
                
                {/* Teaching Tools Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                    <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Teaching Tools
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<QuizIcon />} 
                      onClick={() => setShowQuizDialog(true)}
                      size="small"
                    >
                      Create Quiz
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<ThumbsUpDownIcon />} 
                      color={pollActive ? "success" : "primary"}
                      onClick={() => {
                        if (!pollActive) {
                          setShowPollDialog(true);
                        } else {
                          setPollActive(false);
                          showAlert('Poll ended', 'info');
                        }
                      }}
                      size="small"
                    >
                      {pollActive ? "End Poll" : "Quick Poll"}
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<GroupsIcon />} 
                      onClick={() => setShowBreakoutDialog(true)}
                      size="small"
                    >
                      Breakout Rooms
                    </Button>

                    <Button 
                      variant="outlined" 
                      startIcon={<ForumIcon />} 
                      onClick={() => {
                        showAlert('Chat message sent to all students', 'success');
                        setMessages([
                          ...messages,
                          {
                            id: Date.now(),
                            sender: 'System',
                            text: 'Instructor sent a broadcast message to all students',
                            timestamp: new Date().toISOString()
                          }
                        ]);
                      }}
                      size="small"
                    >
                      Broadcast Message
                    </Button>
                  </Box>
                </Grid>
                
                {/* Content Controls Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                    <ScreenShareIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Content Controls
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Button 
                      variant={isSharing ? "contained" : "outlined"}
                      color={isSharing ? "success" : "primary"}
                      startIcon={isSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                      onClick={handleToggleSharing}
                      size="small"
                    >
                      {isSharing ? "Stop Sharing Code" : "Share Code"}
                    </Button>
                    
                    <FormControl sx={{ minWidth: 160 }} size="small">
                      <InputLabel>Code Visibility</InputLabel>
                      <Select
                        value={codeVisibility}
                        onChange={(e) => {
                          setCodeVisibility(e.target.value);
                          showAlert(`Code visibility set to: ${e.target.value}`, 'info');
                        }}
                        label="Code Visibility"
                      >
                        <MenuItem value="all">All Students</MenuItem>
                        <MenuItem value="groups">Selected Groups</MenuItem>
                        <MenuItem value="individual">Individual Students</MenuItem>
                        <MenuItem value="readonly">Read Only Mode</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<CloudUploadIcon />} 
                      onClick={() => {
                        showAlert('Code examples loaded', 'success');
                        // Logic to show code examples
                      }}
                      size="small"
                    >
                      Load Examples
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      color={isRecording ? "error" : "primary"}
                      startIcon={<RadioButtonCheckedIcon />} 
                      onClick={() => {
                        setIsRecording(!isRecording);
                        showAlert(
                          isRecording ? 'Recording stopped' : 'Session recording started',
                          isRecording ? 'info' : 'success'
                        );
                      }}
                      size="small"
                    >
                      {isRecording ? "Stop Recording" : "Record Session"}
                    </Button>
                  </Box>
                </Grid>
                
                {/* Analytics & Settings Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                    <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Analytics & Settings
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<BarChartIcon />} 
                      onClick={() => setShowAnalytics(true)}
                      size="small"
                    >
                      View Analytics
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<TimerIcon />} 
                      onClick={() => {
                        showAlert('Timer started: 5 minutes', 'info');
                        // Logic for starting timer
                      }}
                      size="small"
                    >
                      Set Timer
                    </Button>
                    
                    <FormControl sx={{ minWidth: 140 }} size="small">
                      <InputLabel>Code Run Speed</InputLabel>
                      <Select
                        value={runSpeed}
                        onChange={(e) => {
                          setRunSpeed(e.target.value);
                          showAlert(`Code execution speed set to: ${e.target.value}`, 'info');
                        }}
                        label="Code Run Speed"
                      >
                        <MenuItem value="slow">Slow (Demo)</MenuItem>
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="fast">Fast</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<SettingsIcon />} 
                      onClick={() => setShowSettingsDialog(true)}
                      size="small"
                    >
                      Session Settings
                    </Button>
                  </Box>
                </Grid>
                
                {/* Current Status Section */}
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 1, mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        <strong>Session Status:</strong> {isSharing ? "Sharing Code" : "Not Sharing"}
                        {isRecording && <Chip size="small" color="error" label="Recording" sx={{ ml: 1 }} />}
                        {pollActive && <Chip size="small" color="secondary" label="Poll Active" sx={{ ml: 1 }} />}
                        {sessionMode === 'focus' && <Chip size="small" color="primary" label="Focus Mode" sx={{ ml: 1 }} />}
                      </Typography>
                      <Box>
                        <Tooltip title="Students with questions">
                          <Chip 
                            icon={<PanToolIcon />} 
                            label="2" 
                            color="secondary"
                            size="small"
                            sx={{ mr: 1 }} 
                          />
                        </Tooltip>
                        <Tooltip title="Students inactive">
                          <Chip 
                            icon={<PriorityHighIcon />} 
                            label="1" 
                            color="warning" 
                            size="small"
                          />
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Code Examples Panel */}
            <Paper sx={{ p: 2, my: 3 }}>
              <Typography variant="h6" gutterBottom>
                Code Examples
              </Typography>
              
              <Grid container spacing={2}>
                {codeExamples.map((example) => (
                  <Grid item xs={12} sm={4} key={example.id}>
                    <Card variant="outlined">
                      <CardContent sx={{ pb: 1 }}>
                        <Typography variant="subtitle1">{example.title}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          onClick={() => {
                            setCode(example.code);
                            showAlert(`Loaded example: ${example.title}`, 'success');
                          }}
                        >
                          Load
                        </Button>
                        <Button 
                          size="small"
                          onClick={() => {
                            setCode(example.code);
                            setIsSharing(true);
                            showAlert(`Example shared with class: ${example.title}`, 'success');
                          }}
                        >
                          Load & Share
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
            
            {/* Student Performance Overview */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Student Engagement
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<BarChartIcon />}
                  onClick={() => setShowAnalytics(true)}
                >
                  Detailed Analytics
                </Button>
              </Box>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Average Engagement
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={78}
                        size={80}
                        thickness={4}
                        color="primary"
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h6" component="div" color="text.primary">
                          78%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Task Completion
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={60}
                        size={80}
                        thickness={4}
                        color="secondary"
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h6" component="div" color="text.primary">
                          60%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Questions Answered
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={85}
                        size={80}
                        thickness={4}
                        color="success"
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h6" component="div" color="text.primary">
                          85%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}
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
                    secondary={
                      msg.emoji ? (
                        <Typography variant="h4" component="span" sx={{ ml: 1 }}>
                          {msg.emoji} {msg.text}
                        </Typography>
                      ) : (
                        msg.text
                      )
                    }
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
      
      {/* Resources Tab */}
      <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Resources
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            Session Materials
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Functions Reference Sheet</Typography>
                  <Typography variant="body2" color="text.secondary">
                    PDF - 520KB
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">View</Button>
                  <Button 
                    size="small" 
                    onClick={() => {
                      showAlert('Resource shared with students', 'success');
                    }}
                  >
                    Share with Class
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Practice Exercises</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ZIP - 1.2MB
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">View</Button>
                  <Button 
                    size="small"
                    onClick={() => {
                      showAlert('Resource shared with students', 'success');
                    }}
                  >
                    Share with Class
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Code Examples</Typography>
                  <Typography variant="body2" color="text.secondary">
                    JS Files - 420KB
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">View</Button>
                  <Button 
                    size="small"
                    onClick={() => {
                      showAlert('Resource shared with students', 'success');
                    }}
                  >
                    Share with Class
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">
              Upload New Resource
            </Typography>
            <Button variant="contained" startIcon={<CloudUploadIcon />}>
              Upload File
            </Button>
          </Box>
        </Paper>
      </Box>
      
      {/* Poll Creation Dialog */}
      <Dialog
        open={showPollDialog}
        onClose={() => setShowPollDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Quick Poll</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Poll Question"
            fullWidth
            variant="outlined"
            defaultValue="How well do you understand functions so far?"
          />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Options
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Option 1"
                defaultValue="Very well"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Option 2"
                defaultValue="Somewhat well"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Option 3"
                defaultValue="Not well"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Option 4"
                defaultValue="I need more explanation"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPollDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setShowPollDialog(false);
              setPollActive(true);
              setCurrentPoll({
                question: "How well do you understand functions so far?",
                options: [
                  "Very well",
                  "Somewhat well", 
                  "Not well", 
                  "I need more explanation"
                ],
                results: [2, 1, 1, 1]  // Mock results
              });
              showAlert('Poll started - Students will now see the poll', 'success');
            }}
          >
            Start Poll
          </Button>
        </DialogActions>
      </Dialog>

      {/* Breakout Rooms Dialog */}
      <Dialog
        open={showBreakoutDialog}
        onClose={() => setShowBreakoutDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Manage Breakout Rooms</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Create Breakout Rooms
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Rooms"
                  defaultValue="3"
                  size="small"
                  InputProps={{ inputProps: { min: 2, max: 10 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minutes"
                  defaultValue="15"
                  size="small"
                  InputProps={{ inputProps: { min: 5, max: 60 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Assignment Method</InputLabel>
                  <Select defaultValue="automatic" label="Assignment Method">
                    <MenuItem value="automatic">Automatic</MenuItem>
                    <MenuItem value="manual">Manual</MenuItem>
                    <MenuItem value="random">Random</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => {
                setBreakoutRooms([
                  { id: 1, name: "Room 1", participants: ["Alex Johnson", "Emma Wilson"] },
                  { id: 2, name: "Room 2", participants: ["Michael Brown"] },
                  { id: 3, name: "Room 3", participants: ["Sarah Davis"] }
                ]);
                showAlert('Breakout rooms created', 'success');
              }}
            >
              Create Rooms
            </Button>
          </Box>
          
          {breakoutRooms.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Current Breakout Rooms
              </Typography>
              <Grid container spacing={2}>
                {breakoutRooms.map((room) => (
                  <Grid item xs={12} sm={4} key={room.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6">{room.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {room.participants.length} participants
                        </Typography>
                        <List dense>
                          {room.participants.map((participant, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={participant} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary">Join</Button>
                        <Button size="small">Message</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  color="error"
                  onClick={() => {
                    setBreakoutRooms([]);
                    showAlert('All breakout rooms closed', 'info');
                  }}
                >
                  Close All Rooms
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBreakoutDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog
        open={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Session Analytics</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Student Engagement
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell align="center">Engagement</TableCell>
                  <TableCell align="center">Questions Asked</TableCell>
                  <TableCell align="center">Code Changes</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participantsList.filter(p => p.role === 'student').map((student) => (
                  <TableRow key={student.id}>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'secondary.main' }}>
                          {student.avatar}
                        </Avatar>
                        {student.name}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.floor(Math.random() * 100)} 
                        sx={{ height: 8, borderRadius: 5, width: '100%' }} 
                      />
                    </TableCell>
                    <TableCell align="center">{Math.floor(Math.random() * 5)}</TableCell>
                    <TableCell align="center">{Math.floor(Math.random() * 10)}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={student.handRaised ? "Question" : "Active"} 
                        color={student.handRaised ? "secondary" : "success"} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Topic Understanding
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Understanding analytics chart would appear here
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Session Timeline
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Timeline analytics chart would appear here
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnalytics(false)}>Close</Button>
          <Button variant="outlined" startIcon={<CloudUploadIcon />}>
            Export Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quiz Creation Dialog */}
      <Dialog
        open={showQuizDialog}
        onClose={() => setShowQuizDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Quiz</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quiz Title"
            fullWidth
            variant="outlined"
            defaultValue="JavaScript Functions Quiz"
          />
          
          <Box sx={{ my: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Question 1
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Question"
              variant="outlined"
              defaultValue="What is the difference between function declarations and function expressions?"
            />
            
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Answer Options
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Option A"
                  defaultValue="Function declarations are hoisted, function expressions are not"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Option B"
                  defaultValue="Function expressions can be anonymous, declarations cannot"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Option C"
                  defaultValue="Both A and B"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Option D"
                  defaultValue="Neither A nor B"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Correct Answer</InputLabel>
                  <Select defaultValue="C" label="Correct Answer">
                    <MenuItem value="A">Option A</MenuItem>
                    <MenuItem value="B">Option B</MenuItem>
                    <MenuItem value="C">Option C</MenuItem>
                    <MenuItem value="D">Option D</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                // Add new question
                showAlert('New question added', 'info');
              }}
            >
              Add Question
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQuizDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setShowQuizDialog(false);
              showAlert('Quiz created and ready to assign', 'success');
            }}
          >
            Create Quiz
          </Button>
        </DialogActions>
      </Dialog>

      {/* Session Settings Dialog */}
      <Dialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Session Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Student Permissions
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow students to run code"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow students to use chat"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow students to raise hand"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable student personal code mode"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Enable peer code review"
                />
              </FormGroup>
              
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                Session Behavior
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-save session history"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Record session"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable notifications"
                />
              </FormGroup>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Participants"
                type="number"
                defaultValue="30"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Session Password"
                type="text"
                defaultValue="demo123"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettingsDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setShowSettingsDialog(false);
              showAlert('Session settings updated', 'success');
            }}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Participants Dialog */}
      <Dialog
        open={showParticipantsDialog}
        onClose={() => setShowParticipantsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Participants ({participantsList.length})</DialogTitle>
        <DialogContent>
          <List>
            {participantsList.map((participant) => (
              <ListItem
                key={participant.id}
                secondaryAction={
                  participant.role !== 'instructor' && (
                    <Box>
                      {participant.handRaised && (
                        <Tooltip title="Student has a question">
                          <Chip 
                            icon={<PanTool
                            label="Question" 
                            color="secondary" 
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        </Tooltip>
                      )}
                      <Button size="small" variant="outlined">
                        Assist
                      </Button>
                    </Box>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: participant.role === 'instructor' ? 'primary.main' : 'secondary.main' }}>
                    {participant.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {participant.name} 
                      {participant.role === 'instructor' && 
                        <Chip size="small" label="Instructor" color="primary" sx={{ ml: 1 }} />
                      }
                    </Box>
                  }
                  secondary={participant.status}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              // Add mock student for demo
              setParticipantsList([
                ...participantsList,
                { 
                  id: Date.now(), 
                  name: 'New Student', 
                  role: 'student', 
                  avatar: 'NS', 
                  status: 'online',
                  handRaised: false
                }
              ]);
              showAlert('Demo student added', 'info');
            }}
            color="primary"
          >
            Add Demo Student
          </Button>
          <Button onClick={() => setShowParticipantsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* End Session Confirmation Dialog */}
      <Dialog
        open={confirmEndDialog}
        onClose={() => setConfirmEndDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          End Session?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to end the session for all participants? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmEndDialog(false)}>Cancel</Button>
          <Button onClick={handleEndSession} autoFocus color="error" variant="contained">
            End Session
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar notifications - placeholder for alerts */}
      <Snackbar
        open={false} 
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          This is a placeholder for alerts
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InstructorLiveSessionPage.jsx;