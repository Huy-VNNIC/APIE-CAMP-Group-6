import React, { useState, useEffect, useContext } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Switch,
  FormControlLabel,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Checkbox
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { LiveSessionContext } from '../contexts/LiveSessionContext';

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
import SettingsIcon from '@mui/icons-material/Settings';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatIcon from '@mui/icons-material/Chat';
import CodeIcon from '@mui/icons-material/Code';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import PrintIcon from '@mui/icons-material/Print';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import WarningIcon from '@mui/icons-material/Warning';

const LiveSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Context with safe defaults
  const context = useContext(LiveSessionContext);
  
  // Safe destructuring with defaults
  const {
    currentSession = null,
    participants = [],
    messages = [],
    sharedCode = { code: '// Start coding here...', language: 'javascript' },
    codeExecutionResult = null,
    handRaisedStudents = [],
    sessionSettings = {},
    isInstructor = false,
    sendMessage = () => {},
    updateSharedCode = () => {},
    runCode = () => {},
    toggleHandRaise = () => {},
    leaveSession = () => {}
  } = context || {};
  
  // Local states
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [theme_mode, setThemeMode] = useState('light');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  // Dialog states
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [isLeavingSession, setIsLeavingSession] = useState(false);
  const [saveNotesOnLeave, setSaveNotesOnLeave] = useState(true);
  const [endSessionForAll, setEndSessionForAll] = useState(false);
  
  // Notification states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Emoji states
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [quickReactions, setQuickReactions] = useState({});
  
  // Performance tracking
  const [sessionStats, setSessionStats] = useState({
    duration: 0,
    linesOfCode: 0,
    executions: 0,
    messagesCount: 0
  });

  // Mock session data if context not available
  const [mockSession] = useState({
    id: id,
    title: 'JavaScript Functions Workshop',
    instructorName: 'John Smith',
    participantCount: 5,
    startTime: new Date().toISOString()
  });

  // Add page unload handler
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (personalNotes) {
        localStorage.setItem(`notes-${id}`, personalNotes);
      }
      localStorage.removeItem('joinedSession');
      localStorage.removeItem('currentSession');
    };

    const handlePopState = () => {
      handleBeforeUnload();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [personalNotes, id]);

  // Load session data
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!context || !currentSession) {
          const joinedSession = localStorage.getItem('joinedSession');
          if (!joinedSession && !currentSession) {
            localStorage.setItem('joinedSession', JSON.stringify({
              id: id || 'session-abc123',
              role: 'student',
              joinedAt: new Date().toISOString()
            }));
          }
        }
        
        const savedNotes = localStorage.getItem(`notes-${id}`);
        if (savedNotes) {
          setPersonalNotes(savedNotes);
        }
        
        const preferences = localStorage.getItem('sessionPreferences');
        if (preferences) {
          try {
            const prefs = JSON.parse(preferences);
            setFontSize(prefs.fontSize || 14);
            setThemeMode(prefs.theme || 'light');
            setShowLineNumbers(prefs.showLineNumbers !== false);
            setAutoSave(prefs.autoSave !== false);
            setNotifications(prefs.notifications !== false);
          } catch (error) {
            console.error('Error parsing preferences:', error);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading session:', error);
        showSnackbar('Error loading session', 'error');
        setIsLoading(false);
      }
    };
    
    loadSession();
  }, [id, currentSession, context]);

  // Auto-save notes
  useEffect(() => {
    if (autoSave && personalNotes && id) {
      const saveTimeout = setTimeout(() => {
        localStorage.setItem(`notes-${id}`, personalNotes);
      }, 1000);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [personalNotes, autoSave, id]);

  // Session duration tracker
  useEffect(() => {
    const sessionToUse = currentSession || mockSession;
    if (sessionToUse) {
      const interval = setInterval(() => {
        const startTime = new Date(sessionToUse.startTime);
        const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
        setSessionStats(prev => ({ ...prev, duration }));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [currentSession, mockSession]);

  // Code metrics tracking
  useEffect(() => {
    if (sharedCode && sharedCode.code) {
      const lines = sharedCode.code.split('\n').length;
      setSessionStats(prev => ({ ...prev, linesOfCode: lines }));
    }
  }, [sharedCode]);

  // Messages count tracking
  useEffect(() => {
    if (Array.isArray(messages)) {
      setSessionStats(prev => ({ ...prev, messagesCount: messages.length }));
    }
  }, [messages]);

  // Handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCodeChange = (value) => {
    if (isInstructor || sessionSettings.allowStudentCode) {
      updateSharedCode(value, codeLanguage);
    }
  };

  const handleRunCode = () => {
    runCode();
    setSessionStats(prev => ({ ...prev, executions: prev.executions + 1 }));
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessage(message);
    setMessage('');
  };

  const handleEmojiClick = (emoji) => {
    sendMessage(emoji);
    setEmojiAnchor(null);
  };

  const handleQuickReaction = (emoji) => {
    const newReactions = { ...quickReactions };
    newReactions[emoji] = (newReactions[emoji] || 0) + 1;
    setQuickReactions(newReactions);
    sendMessage(`${emoji}`);
  };

  const handleLeaveSession = () => {
    setShowConfirmLeave(true);
  };

  // Emergency leave function that always works
  const emergencyLeave = () => {
    console.log('Emergency leave activated');
    
    try {
      if (personalNotes) {
        localStorage.setItem(`notes-${id}`, personalNotes);
      }
    } catch (e) {
      console.warn('Could not save notes:', e);
    }
    
    try {
      localStorage.removeItem('joinedSession');
      localStorage.removeItem('currentSession');
      localStorage.removeItem(`session-${id}`);
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    
    // Force navigation with multiple fallbacks
    try {
      navigate('/live-sessions', { replace: true });
    } catch (e) {
      console.warn('React Router failed, using window.location');
      window.location.replace('/live-sessions');
    }
  };

  // Main leave function with proper error handling
  const confirmLeave = async () => {
    console.log('Starting leave session process...');
    setIsLeavingSession(true);
    
    try {
      // 1. Save notes immediately
      if (saveNotesOnLeave && personalNotes) {
        try {
          localStorage.setItem(`notes-${id}`, personalNotes);
          console.log('Notes saved successfully');
        } catch (e) {
          console.warn('Could not save notes:', e);
        }
      }
      
      // 2. Clean up localStorage immediately
      try {
        localStorage.removeItem('joinedSession');
        localStorage.removeItem('currentSession');
        localStorage.removeItem(`session-${id}`);
        console.log('LocalStorage cleaned up');
      } catch (e) {
        console.warn('Could not clean localStorage:', e);
      }
      
      // 3. Try context leave session with timeout
      if (leaveSession && typeof leaveSession === 'function') {
        try {
          console.log('Attempting context leave session...');
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Leave session timeout')), 2000)
          );
          
          const leavePromise = isInstructor && endSessionForAll 
            ? leaveSession({ endForAll: true })
            : leaveSession();
          
          await Promise.race([leavePromise, timeoutPromise]);
          console.log('Context leave session completed');
        } catch (error) {
          console.warn('Context leave session failed or timed out:', error);
          // Continue with navigation anyway
        }
      }
      
      // 4. Reset dialog states
      setShowConfirmLeave(false);
      setIsLeavingSession(false);
      setSaveNotesOnLeave(true);
      setEndSessionForAll(false);
      
      // 5. Show success message
      const successMessage = isInstructor && endSessionForAll 
        ? 'Session ended for all participants' 
        : 'Successfully left the session';
      
      showSnackbar(successMessage, 'success');
      
      // 6. Navigate with multiple fallbacks
      console.log('Attempting navigation...');
      
      // Try immediate navigation first
      try {
        navigate('/live-sessions', { replace: true });
        console.log('React Router navigation initiated');
      } catch (navError) {
        console.warn('React Router navigation failed:', navError);
        // Fallback to window.location
        setTimeout(() => {
          window.location.replace('/live-sessions');
        }, 500);
      }
      
      // Additional fallback after 3 seconds
      setTimeout(() => {
        if (window.location.pathname.includes('live-session')) {
          console.log('Navigation seems to have failed, forcing redirect...');
          window.location.href = '/live-sessions';
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error in confirmLeave:', error);
      setIsLeavingSession(false);
      
      // Show error but still try to navigate
      showSnackbar('Error leaving session, but will redirect anyway', 'warning');
      
      // Force navigation even if there's an error
      setTimeout(() => {
        emergencyLeave();
      }, 1500);
    }
  };

  const cancelLeave = () => {
    if (!isLeavingSession) {
      setShowConfirmLeave(false);
      setSaveNotesOnLeave(true);
      setEndSessionForAll(false);
    }
  };

  const handleToggleSharing = () => {
    setIsSharing(!isSharing);
    showSnackbar(
      isSharing ? 'Stopped sharing screen' : 'Started sharing screen',
      'info'
    );
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const savePreferences = () => {
    const preferences = {
      fontSize,
      theme: theme_mode,
      showLineNumbers,
      autoSave,
      notifications
    };
    localStorage.setItem('sessionPreferences', JSON.stringify(preferences));
    showSnackbar('Preferences saved', 'success');
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const codeLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' }
  ];

  const emojis = ['👍', '👎', '❤️', '😄', '😮', '😢', '😡', '👏', '🎉', '🔥'];

  // Use current session or mock session
  const sessionToDisplay = currentSession || mockSession;

  // Dynamic colors based on theme
  const getThemeColors = () => {
    if (theme_mode === 'dark') {
      return {
        background: '#121212',
        paper: '#1e1e1e',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        border: '#333333',
        codeBackground: '#0d1117',
        headerBackground: '#2d2d2d'
      };
    } else {
      return {
        background: '#fafafa',
        paper: '#ffffff',
        text: '#333333',
        textSecondary: '#666666',
        border: '#e0e0e0',
        codeBackground: '#f8f9fa',
        headerBackground: '#f5f5f5'
      };
    }
  };

  const colors = getThemeColors();

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: colors.background
      }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2, color: colors.text }}>
          Joining session...
        </Typography>
      </Box>
    );
  }

  if (!sessionToDisplay) {
    return (
      <Container maxWidth="md" sx={{ py: 4, bgcolor: colors.background, minHeight: '100vh' }}>
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: colors.paper }}>
          <Typography variant="h4" color="error" gutterBottom>
            Session Not Found
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: colors.textSecondary }}>
            The session you're trying to join doesn't exist or has ended.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/live-sessions')}
            size="large"
          >
            Back to Live Sessions
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: colors.background, 
      minHeight: '100vh',
      pb: 3
    }}>
      <Container maxWidth="xl" sx={{ pt: 2 }}>
        {/* Enhanced Header */}
        <Paper 
          elevation={2}
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: colors.headerBackground,
            borderRadius: 2,
            border: `1px solid ${colors.border}`
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ color: colors.text, fontWeight: 600 }}>
                {sessionToDisplay.title}
                {isInstructor && <Chip label="Instructor" color="primary" size="small" sx={{ ml: 2 }} />}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
                Session ID: {sessionToDisplay.id}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Theme Toggle */}
              <Tooltip title={theme_mode === 'dark' ? "Switch to light mode" : "Switch to dark mode"}>
                <IconButton 
                  onClick={() => setThemeMode(theme_mode === 'dark' ? 'light' : 'dark')}
                  sx={{ color: colors.text }}
                >
                  {theme_mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>

              {/* Audio/Video Controls */}
              <Tooltip title={audioEnabled ? "Mute audio" : "Unmute audio"}>
                <IconButton onClick={() => setAudioEnabled(!audioEnabled)} color={audioEnabled ? "primary" : "default"}>
                  {audioEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title={micEnabled ? "Mute microphone" : "Unmute microphone"}>
                <IconButton onClick={() => setMicEnabled(!micEnabled)} color={micEnabled ? "primary" : "default"}>
                  {micEnabled ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title={videoEnabled ? "Turn off camera" : "Turn on camera"}>
                <IconButton onClick={() => setVideoEnabled(!videoEnabled)} color={videoEnabled ? "primary" : "default"}>
                  <VideocamIcon />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: colors.border }} />

              {/* Participants Count */}
              <Tooltip title="Participants">
                <Button 
                  variant="outlined"
                  onClick={() => setShowParticipants(true)}
                  startIcon={<PeopleIcon />}
                  size="small"
                  sx={{ 
                    borderColor: colors.border,
                    color: colors.text,
                    '&:hover': { 
                      borderColor: 'primary.main',
                      bgcolor: 'primary.light'
                    }
                  }}
                >
                  {participants.length || sessionToDisplay.participantCount || 0}
                </Button>
              </Tooltip>

              {/* Hand Raise (Students only) */}
              {!isInstructor && (
                <Tooltip title={handRaisedStudents.includes('currentUserId') ? "Lower hand" : "Raise hand"}>
                  <IconButton 
                    onClick={toggleHandRaise}
                    color={handRaisedStudents.includes('currentUserId') ? "secondary" : "default"}
                  >
                    <PanToolIcon />
                  </IconButton>
                </Tooltip>
              )}

              {/* Settings */}
              <Tooltip title="Settings">
                <IconButton onClick={() => setShowSettings(true)} sx={{ color: colors.text }}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>

              {/* Fullscreen */}
              <Tooltip title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
                <IconButton onClick={handleFullscreen} sx={{ color: colors.text }}>
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
              </Tooltip>

              {/* Emergency Exit */}
              <Tooltip title="Emergency Exit (Double-click)">
                <IconButton 
                  onDoubleClick={emergencyLeave}
                  sx={{ color: 'error.main' }}
                  size="small"
                >
                  🚨
                </IconButton>
              </Tooltip>

              {/* Leave Session Button - Enhanced */}
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={isLeavingSession ? <CircularProgress size={16} /> : <ExitToAppIcon />}
                onClick={handleLeaveSession}
                onDoubleClick={emergencyLeave}
                size="small"
                disabled={isLeavingSession}
              >
                {isLeavingSession ? 'Leaving...' : 'Leave'}
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Instructor: {sessionToDisplay.instructorName} • Duration: {formatDuration(sessionStats.duration)}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip 
                label={`${sessionStats.linesOfCode} lines`} 
                size="small" 
                variant="outlined"
                sx={{ borderColor: colors.border, color: colors.text }}
              />
              <Chip 
                label={`${sessionStats.executions} runs`} 
                size="small" 
                variant="outlined"
                sx={{ borderColor: colors.border, color: colors.text }}
              />
              <Chip 
                label={`${sessionStats.messagesCount} messages`} 
                size="small" 
                variant="outlined"
                sx={{ borderColor: colors.border, color: colors.text }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Enhanced Tabs */}
        <Paper 
          elevation={1}
          sx={{ 
            mb: 3, 
            bgcolor: colors.paper,
            borderRadius: 2,
            border: `1px solid ${colors.border}`
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: colors.textSecondary,
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '1rem'
              },
              '& .Mui-selected': {
                color: 'primary.main'
              }
            }}
          >
            <Tab icon={<CodeIcon />} iconPosition="start" label="Code Editor" />
            <Tab 
              icon={
                <Badge badgeContent={messages.length > 0 ? messages.length : null} color="secondary">
                  <ChatIcon />
                </Badge>
              } 
              iconPosition="start" 
              label="Chat" 
            />
            <Tab icon={<NoteIcon />} iconPosition="start" label="Notes" />
            <Tab icon={<AssignmentIcon />} iconPosition="start" label="Resources" />
            {isInstructor && <Tab icon={<BarChartIcon />} iconPosition="start" label="Analytics" />}
          </Tabs>
        </Paper>

        {/* Code Editor Tab */}
        <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
          {/* Code Editor Controls */}
          <Paper 
            elevation={1}
            sx={{ 
              p: 3, 
              mb: 3, 
              bgcolor: colors.paper,
              borderRadius: 2,
              border: `1px solid ${colors.border}`
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    label="Language"
                  >
                    {codeLanguages.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
                  <Typography variant="body2" sx={{ color: colors.text }}>Size:</Typography>
                  <Slider
                    value={fontSize}
                    onChange={(e, value) => setFontSize(value)}
                    min={10}
                    max={24}
                    size="small"
                    sx={{ width: 80 }}
                  />
                  <Typography variant="body2" sx={{ color: colors.text, minWidth: 35 }}>{fontSize}px</Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={showLineNumbers}
                      onChange={(e) => setShowLineNumbers(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Line numbers"
                  sx={{ color: colors.text }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {isInstructor && (
                  <Button 
                    variant={isSharing ? "contained" : "outlined"}
                    color={isSharing ? "success" : "primary"}
                    startIcon={isSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                    onClick={handleToggleSharing}
                    size="small"
                  >
                    {isSharing ? "Stop Sharing" : "Share Screen"}
                  </Button>
                )}
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleRunCode}
                  startIcon={<PlayArrowIcon />}
                  disabled={!isInstructor && !sessionSettings.allowStudentCode}
                  size="small"
                >
                  Run Code
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={() => {
                    const code = sharedCode?.code || '// No code available';
                    const blob = new Blob([code], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `session-${id}-code.${codeLanguage}`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  size="small"
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              {/* Enhanced Code Editor */}
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  bgcolor: colors.paper,
                  borderRadius: 2,
                  border: `1px solid ${colors.border}`
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: colors.text, fontWeight: 600 }}>
                    {isInstructor ? 'Code Editor' : 'Shared Code'}
                  </Typography>
                  {!isInstructor && !sessionSettings.allowStudentCode && 
                    <Chip label="Read-only" size="small" color="warning" />
                  }
                </Box>
                
                <TextField
                  fullWidth
                  multiline
                  rows={20}
                  variant="outlined"
                  value={sharedCode?.code || '// Start coding here...'}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  disabled={!isInstructor && !sessionSettings.allowStudentCode}
                  sx={{ 
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    '& .MuiInputBase-root': {
                      bgcolor: colors.codeBackground,
                      fontSize: `${fontSize}px`,
                      lineHeight: 1.6,
                    },
                    '& .MuiInputBase-input': {
                      color: colors.text,
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border,
                    }
                  }}
                />
              </Paper>

              {/* Enhanced Output */}
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3, 
                  bgcolor: colors.paper,
                  borderRadius: 2,
                  border: `1px solid ${colors.border}`
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: colors.text, fontWeight: 600 }}>
                    Output
                  </Typography>
                  {codeExecutionResult && (
                    <Chip 
                      label={`Executed in ${codeExecutionResult.executionTime || 0}ms`} 
                      size="small" 
                      color="success"
                    />
                  )}
                </Box>
                
                <Box sx={{ 
                  p: 3, 
                  bgcolor: theme_mode === 'dark' ? '#0a0a0a' : '#f8f9fa', 
                  color: theme_mode === 'dark' ? '#00ff00' : '#333333', 
                  borderRadius: 2,
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: `${fontSize}px`,
                  height: '300px',
                  overflow: 'auto',
                  border: `2px solid ${colors.border}`,
                  whiteSpace: 'pre-wrap'
                }}>
                  {codeExecutionResult ? codeExecutionResult.output : 'Run code to see output here...'}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              {/* Enhanced Session Info */}
              <Paper 
                elevation={1}
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  bgcolor: colors.paper,
                  borderRadius: 2,
                  border: `1px solid ${colors.border}`
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: colors.text, fontWeight: 600 }}>
                  Session Info
                </Typography>
                
                <Divider sx={{ mb: 2, borderColor: colors.border }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
                    <strong>Session ID:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text, fontFamily: 'monospace' }}>
                    {sessionToDisplay.id}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
                    <strong>Participants:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text }}>
                    {participants.length || sessionToDisplay.participantCount || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
                    <strong>Language:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text }}>
                    {codeLanguages.find(l => l.value === codeLanguage)?.label}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
                    <strong>Started:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text }}>
                    {new Date(sessionToDisplay.startTime).toLocaleString()}
                  </Typography>
                </Box>

                {handRaisedStudents.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: colors.text, mb: 1 }}>
                      Raised Hands ({handRaisedStudents.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {handRaisedStudents.map((studentId, index) => (
                        <Chip 
                          key={studentId}
                          label={`Student ${index + 1}`}
                          size="small"
                          color="secondary"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>

              {/* Quick Actions */}
              <Paper 
                elevation={1}
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  bgcolor: colors.paper,
                  borderRadius: 2,
                  border: `1px solid ${colors.border}`
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: colors.text, fontWeight: 600 }}>
                  Quick Actions
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<BookmarksIcon />}
                      onClick={() => setActiveTab(2)}
                      size="small"
                      sx={{ borderColor: colors.border, color: colors.text }}
                    >
                      Notes
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: sessionToDisplay.title,
                            text: 'Join my live coding session',
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          showSnackbar('Session link copied to clipboard', 'success');
                        }
                      }}
                      size="small"
                      sx={{ borderColor: colors.border, color: colors.text }}
                    >
                      Share
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<PrintIcon />}
                      onClick={() => window.print()}
                      size="small"
                      sx={{ borderColor: colors.border, color: colors.text }}
                    >
                      Print
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        const content = `Session: ${sessionToDisplay.title}\nCode:\n${sharedCode?.code || ''}\n\nNotes:\n${personalNotes}`;
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `session-${id}-export.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      size="small"
                      sx={{ borderColor: colors.border, color: colors.text }}
                    >
                      Export
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {/* Performance Stats */}
              <Paper 
                elevation={1}
                sx={{ 
                  p: 3, 
                  bgcolor: colors.paper,
                  borderRadius: 2,
                  border: `1px solid ${colors.border}`
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: colors.text, fontWeight: 600 }}>
                  Session Stats
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: colors.background, borderRadius: 1 }}>
                      <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                        {sessionStats.executions}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        Code Runs
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: colors.background, borderRadius: 1 }}>
                      <Typography variant="h3" color="secondary" sx={{ fontWeight: 700 }}>
                        {sessionStats.linesOfCode}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        Lines of Code
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Enhanced Chat Tab */}
        <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
          <Paper 
            elevation={2}
            sx={{ 
              height: '700px', 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: colors.paper,
              borderRadius: 2,
              border: `1px solid ${colors.border}`
            }}
          >
            {/* Chat Header */}
            <Box sx={{ p: 3, borderBottom: `1px solid ${colors.border}` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: colors.text, fontWeight: 600 }}>
                  Chat ({messages.length})
                </Typography>
                <Box>
                  <IconButton
                    onClick={(e) => setEmojiAnchor(e.currentTarget)}
                    size="small"
                    sx={{ color: colors.text }}
                  >
                    <EmojiEmotionsIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: colors.text }}>
                    <AttachFileIcon />
                  </IconButton>
                </Box>
              </Box>
              
              {/* Quick Reactions */}
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                {emojis.slice(0, 5).map((emoji) => (
                  <Button
                    key={emoji}
                    size="small"
                    onClick={() => handleQuickReaction(emoji)}
                    sx={{ 
                      minWidth: 'auto', 
                      p: 1,
                      bgcolor: colors.background,
                      border: `1px solid ${colors.border}`,
                      '&:hover': {
                        bgcolor: 'primary.light'
                      }
                    }}
                  >
                    <Typography variant="h6">{emoji}</Typography>
                    {quickReactions[emoji] && (
                      <Typography variant="caption" sx={{ ml: 0.5, color: colors.text }}>
                        {quickReactions[emoji]}
                      </Typography>
                    )}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto', bgcolor: colors.background }}>
              <List>
                {Array.isArray(messages) && messages.length > 0 ? messages.map((msg) => (
                  <ListItem key={msg.id} alignItems="flex-start" sx={{ mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: msg.sender === 'You' ? 'primary.main' : 'secondary.main',
                        width: 40,
                        height: 40
                      }}>
                        {msg.sender.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ color: colors.text, fontWeight: 600 }}>
                            {msg.sender}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Paper 
                          elevation={0}
                          sx={{ 
                            p: 2, 
                            mt: 1,
                            bgcolor: msg.sender === 'You' ? 'primary.light' : colors.paper,
                            borderRadius: 2,
                            border: `1px solid ${colors.border}`
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: colors.text,
                              wordBreak: 'break-word'
                            }}
                          >
                            {msg.emoji ? (
                              <span style={{ fontSize: '1.2em' }}>{msg.emoji} {msg.text}</span>
                            ) : (
                              msg.text
                            )}
                          </Typography>
                        </Paper>
                      }
                    />
                  </ListItem>
                )) : (
                  <ListItem>
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="body1" 
                          sx={{ color: colors.textSecondary, textAlign: 'center', py: 4 }}
                        >
                          No messages yet. Start the conversation! 💬
                        </Typography>
                      } 
                    />
                  </ListItem>
                )}
              </List>
            </Box>

            {/* Message Input */}
            <Box sx={{ p: 3, borderTop: `1px solid ${colors.border}`, bgcolor: colors.paper }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  size="small"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  multiline
                  maxRows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: colors.background,
                      '& fieldset': {
                        borderColor: colors.border,
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: colors.text,
                    }
                  }}
                />
                <Button 
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  startIcon={<SendIcon />}
                  sx={{ 
                    minWidth: 'auto',
                    height: 40
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Personal Notes Tab */}
        <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 4, 
              bgcolor: colors.paper,
              borderRadius: 2,
              border: `1px solid ${colors.border}`
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ color: colors.text, fontWeight: 600 }}>
                Personal Notes
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Auto-save"
                  sx={{ color: colors.text }}
                />
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => {
                    localStorage.setItem(`notes-${id}`, personalNotes);
                    showSnackbar('Notes saved successfully', 'success');
                  }}
                  size="small"
                >
                  Save Notes
                </Button>
              </Box>
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={25}
              variant="outlined"
              placeholder="Take your personal notes here...

• Key points from the session
• Questions to ask later
• Code snippets to remember
• Personal insights"
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: colors.background,
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.6,
                  '& fieldset': {
                    borderColor: colors.border,
                  }
                },
                '& .MuiInputBase-input': {
                  color: colors.text,
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }
              }}
            />
          </Paper>
        </Box>

        {/* Enhanced Resources Tab */}
        <Box sx={{ display: activeTab === 3 ? 'block' : 'none' }}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 4, 
              bgcolor: colors.paper,
              borderRadius: 2,
              border: `1px solid ${colors.border}`
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: colors.text, fontWeight: 600, mb: 3 }}>
              Session Resources
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card 
                  elevation={1}
                  sx={{ 
                    height: '100%',
                    bgcolor: colors.background,
                    border: `1px solid ${colors.border}`,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: colors.text, mb: 2 }}>
                      📚 Code Documentation
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                      Complete language reference and examples for {codeLanguages.find(l => l.value === codeLanguage)?.label}
                    </Typography>
                    <Chip label="PDF • 2.4 MB" size="small" sx={{ mr: 1 }} />
                    <Chip label="Updated today" size="small" color="success" />
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => showSnackbar('Opening documentation...', 'info')}
                    >
                      View
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => showSnackbar('Downloading documentation...', 'success')}
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  elevation={1}
                  sx={{ 
                    height: '100%',
                    bgcolor: colors.background,
                    border: `1px solid ${colors.border}`,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: colors.text, mb: 2 }}>
                      🎥 Session Recording
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                      Video recording of this session (available after session ends)
                    </Typography>
                    <Chip label="MP4 • Processing" size="small" sx={{ mr: 1 }} />
                    <Chip label="Live" size="small" color="error" />
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      disabled
                      onClick={() => showSnackbar('Recording will be available after session ends', 'info')}
                    >
                      Watch
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      disabled
                      onClick={() => showSnackbar('Recording will be available after session ends', 'info')}
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  elevation={1}
                  sx={{ 
                    height: '100%',
                    bgcolor: colors.background,
                    border: `1px solid ${colors.border}`,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: colors.text, mb: 2 }}>
                      📝 Exercise Files
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                      Practice exercises and solutions related to today's topics
                    </Typography>
                    <Chip label="ZIP • 1.2 MB" size="small" sx={{ mr: 1 }} />
                    <Chip label="15 exercises" size="small" color="primary" />
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => showSnackbar('Opening exercise preview...', 'info')}
                    >
                      Preview
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => showSnackbar('Downloading exercise files...', 'success')}
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>

            {/* Additional Resources */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: colors.text, fontWeight: 600 }}>
                Additional Resources
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      bgcolor: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: colors.text, mb: 1 }}>
                      📖 MDN Web Docs
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                      Official Mozilla documentation for JavaScript
                    </Typography>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => window.open('https://developer.mozilla.org/en-US/docs/Web/JavaScript', '_blank')}
                    >
                      Open External Link
                    </Button>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      bgcolor: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: colors.text, mb: 1 }}>
                      💡 Interactive Coding Playground
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                      Practice coding with instant feedback
                    </Typography>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => showSnackbar('Opening coding playground...', 'info')}
                    >
                      Launch Playground
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>

        {/* Analytics Tab (Instructor only) */}
        {isInstructor && (
          <Box sx={{ display: activeTab === 4 ? 'block' : 'none' }}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 4, 
                bgcolor: colors.paper,
                borderRadius: 2,
                border: `1px solid ${colors.border}`
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: colors.text, fontWeight: 600, mb: 3 }}>
                Session Analytics
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>
                    Participant Engagement
                  </Typography>
                  <TableContainer 
                    component={Paper} 
                    elevation={0}
                    sx={{ bgcolor: colors.background, border: `1px solid ${colors.border}` }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Participant</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Messages</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Code Activity</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Engagement</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(participants) && participants.length > 0 ? participants.map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell>{participant.fullName || participant.name}</TableCell>
                            <TableCell align="center">
                              {messages.filter(m => m.sender === (participant.fullName || participant.name)).length}
                            </TableCell>
                            <TableCell align="center">
                                                            <LinearProgress 
                                variant="determinate" 
                                value={Math.random() * 100} 
                                sx={{ height: 10, borderRadius: 5 }} 
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={Math.floor(Math.random() * 100) + '%'} 
                                color="primary" 
                                size="small" 
                              />
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <Typography variant="body2" sx={{ color: colors.textSecondary, py: 2 }}>
                                No participants data available
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>
                    Session Metrics
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text, mb: 1 }}>
                        Average Engagement
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={78} 
                        sx={{ 
                          height: 12, 
                          borderRadius: 6,
                          bgcolor: colors.background
                        }} 
                      />
                      <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        78%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text, mb: 1 }}>
                        Code Participation
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={65} 
                        color="secondary" 
                        sx={{ 
                          height: 12, 
                          borderRadius: 6,
                          bgcolor: colors.background
                        }} 
                      />
                      <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        65%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text, mb: 1 }}>
                        Chat Activity
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={84} 
                        color="success" 
                        sx={{ 
                          height: 12, 
                          borderRadius: 6,
                          bgcolor: colors.background
                        }} 
                      />
                      <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        84%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {/* Dialogs */}
        
        {/* Participants Dialog */}
        <Dialog
          open={showParticipants}
          onClose={() => setShowParticipants(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { bgcolor: colors.paper, border: `1px solid ${colors.border}` }
          }}
        >
          <DialogTitle sx={{ color: colors.text }}>
            Participants ({participants.length || sessionToDisplay.participantCount || 0})
          </DialogTitle>
          <DialogContent>
            <List>
              {Array.isArray(participants) && participants.length > 0 ? participants.map((participant) => (
                <ListItem key={participant.id} sx={{ py: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: participant.role === 'instructor' ? 'primary.main' : 'secondary.main',
                      width: 40,
                      height: 40
                    }}>
                      {(participant.fullName || participant.name || 'U').charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography sx={{ color: colors.text, fontWeight: 500 }}>
                        {participant.fullName || participant.name}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: colors.textSecondary }}>
                        {participant.role}
                      </Typography>
                    }
                  />
                  {handRaisedStudents.includes(participant.id) && (
                    <Chip icon={<PanToolIcon />} label="Hand raised" color="secondary" size="small" />
                  )}
                </ListItem>
              )) : (
                <ListItem>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ color: colors.textSecondary, textAlign: 'center', py: 2 }}>
                        No participants information available
                      </Typography>
                    } 
                  />
                </ListItem>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowParticipants(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog
          open={showSettings}
          onClose={() => setShowSettings(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { bgcolor: colors.paper, border: `1px solid ${colors.border}` }
          }}
        >
          <DialogTitle sx={{ color: colors.text }}>Session Settings</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                }
                label="Enable notifications"
                sx={{ color: colors.text }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                  />
                }
                label="Auto-save notes"
                sx={{ color: colors.text }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={showLineNumbers}
                    onChange={(e) => setShowLineNumbers(e.target.checked)}
                  />
                }
                label="Show line numbers in code editor"
                sx={{ color: colors.text }}
              />

              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={theme_mode}
                  onChange={(e) => setThemeMode(e.target.value)}
                  label="Theme"
                >
                  <MenuItem value="light">Light Theme</MenuItem>
                  <MenuItem value="dark">Dark Theme</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography gutterBottom sx={{ color: colors.text }}>
                  Font Size: {fontSize}px
                </Typography>
                <Slider
                  value={fontSize}
                  onChange={(e, value) => setFontSize(value)}
                  min={10}
                  max={24}
                  step={1}
                  marks={[
                    { value: 10, label: '10px' },
                    { value: 14, label: '14px' },
                    { value: 18, label: '18px' },
                    { value: 24, label: '24px' }
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSettings(false)}>Cancel</Button>
            <Button 
              onClick={() => { 
                savePreferences(); 
                setShowSettings(false); 
              }} 
              variant="contained"
            >
              Save Settings
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Leave Session Confirmation Dialog */}
        <Dialog
          open={showConfirmLeave}
          onClose={cancelLeave}
          maxWidth="sm"
          fullWidth
          disableEscapeKeyDown={isLeavingSession}
          PaperProps={{
            sx: { 
              bgcolor: colors.paper, 
              border: `1px solid ${colors.border}`
            }
          }}
        >
          <DialogTitle sx={{ 
            color: colors.text,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <ExitToAppIcon color="error" />
            {isInstructor ? 'End Session?' : 'Leave Session?'}
          </DialogTitle>
          
          <DialogContent>
            <DialogContentText sx={{ color: colors.text, mb: 2 }}>
              {isInstructor 
                ? 'Are you sure you want to end this session? This action will affect all participants.'
                : 'Are you sure you want to leave this session? Your notes will be saved automatically.'
              }
            </DialogContentText>

            {isLeavingSession && (
              <Alert 
                severity="info" 
                sx={{ mb: 2 }}
                icon={<CircularProgress size={20} />}
              >
                {isInstructor && endSessionForAll 
                  ? 'Ending session for all participants...' 
                  : 'Leaving session, please wait...'
                }
              </Alert>
            )}

            {/* Save notes option */}
            {personalNotes && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={saveNotesOnLeave}
                    onChange={(e) => setSaveNotesOnLeave(e.target.checked)}
                    color="primary"
                    disabled={isLeavingSession}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SaveIcon fontSize="small" />
                    <Typography variant="body2">
                      Save my personal notes automatically
                    </Typography>
                  </Box>
                }
                sx={{ color: colors.text }}
              />
            )}

            {/* End session for all (instructor only) */}
            {isInstructor && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={endSessionForAll}
                    onChange={(e) => setEndSessionForAll(e.target.checked)}
                    color="warning"
                    disabled={isLeavingSession}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon fontSize="small" color="warning" />
                    <Typography variant="body2">
                      End session for all participants
                    </Typography>
                  </Box>
                }
                sx={{ color: colors.text, mt: 1 }}
              />
            )}

            {endSessionForAll && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                This will immediately end the session for all participants. 
                They will be redirected to the main page.
              </Alert>
            )}

            {/* Session info for confirmation */}
            <Paper 
              elevation={0}
              sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: colors.background,
                border: `1px solid ${colors.border}`
              }}
            >
              <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
                Session Details:
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text }}>
                <strong>Title:</strong> {sessionToDisplay.title}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text }}>
                <strong>Duration:</strong> {formatDuration(sessionStats.duration)}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text }}>
                <strong>Participants:</strong> {participants.length || sessionToDisplay.participantCount || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text }}>
                <strong>Current Time:</strong> {new Date().toLocaleString()}
              </Typography>
            </Paper>
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={cancelLeave}
              disabled={isLeavingSession}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmLeave}
              disabled={isLeavingSession}
              color="error" 
              variant="contained"
              startIcon={isLeavingSession ? <CircularProgress size={16} /> : <ExitToAppIcon />}
            >
              {isLeavingSession 
                ? (isInstructor && endSessionForAll ? 'Ending Session...' : 'Leaving Session...') 
                : (isInstructor && endSessionForAll ? 'End Session' : 'Leave Session')
              }
            </Button>
          </DialogActions>
        </Dialog>

        {/* Emoji Menu */}
        <Menu
          anchorEl={emojiAnchor}
          open={Boolean(emojiAnchor)}
          onClose={() => setEmojiAnchor(null)}
          PaperProps={{
            sx: { 
              bgcolor: colors.paper, 
              border: `1px solid ${colors.border}`,
              maxHeight: 300,
              overflow: 'auto'
            }
          }}
        >
          {emojis.map((emoji) => (
            <MenuItem key={emoji} onClick={() => handleEmojiClick(emoji)}>
              <Typography variant="h5" sx={{ mr: 1 }}>{emoji}</Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                {emoji === '👍' && 'Thumbs up'}
                {emoji === '👎' && 'Thumbs down'}
                {emoji === '❤️' && 'Love'}
                {emoji === '😄' && 'Happy'}
                {emoji === '😮' && 'Surprised'}
                {emoji === '😢' && 'Sad'}
                {emoji === '😡' && 'Angry'}
                {emoji === '👏' && 'Applause'}
                {emoji === '🎉' && 'Celebration'}
                {emoji === '🔥' && 'Fire'}
              </Typography>
            </MenuItem>
          ))}
        </Menu>

        {/* Enhanced Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          sx={{ 
            bottom: { xs: 90, md: 24 },
          }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ 
              width: '100%',
              bgcolor: colors.paper,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              '& .MuiAlert-icon': {
                color: snackbar.severity === 'error' ? 'error.main' : 
                       snackbar.severity === 'warning' ? 'warning.main' :
                       snackbar.severity === 'success' ? 'success.main' : 'info.main'
              }
            }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <Box sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1,
            zIndex: 1000
          }}>
            {!isInstructor && (
              <Tooltip title={handRaisedStudents.includes('currentUserId') ? "Lower hand" : "Raise hand"}>
                <Button
                  variant="contained"
                  color={handRaisedStudents.includes('currentUserId') ? "secondary" : "primary"}
                  onClick={toggleHandRaise}
                  sx={{ 
                    minWidth: 56,
                    height: 56,
                    borderRadius: '50%',
                    boxShadow: 3,
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <PanToolIcon />
                </Button>
              </Tooltip>
            )}
            
            <Tooltip title="Chat">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setActiveTab(1)}
                sx={{ 
                  minWidth: 56,
                  height: 56,
                  borderRadius: '50%',
                  boxShadow: 3,
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Badge badgeContent={messages.length > 0 ? messages.length : null} color="secondary">
                  <ChatIcon />
                </Badge>
              </Button>
            </Tooltip>

            {/* Quick Leave Button for Mobile */}
            <Tooltip title="Leave Session">
              <Button
                variant="contained"
                color="error"
                onClick={handleLeaveSession}
                onDoubleClick={emergencyLeave}
                disabled={isLeavingSession}
                sx={{ 
                  minWidth: 56,
                  height: 56,
                  borderRadius: '50%',
                  boxShadow: 3,
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                {isLeavingSession ? <CircularProgress size={24} /> : <ExitToAppIcon />}
              </Button>
            </Tooltip>
          </Box>
        )}

        {/* Loading overlay for leave session */}
        {isLeavingSession && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <Paper sx={{ 
              p: 4, 
              textAlign: 'center', 
              bgcolor: colors.paper,
              borderRadius: 2,
              minWidth: 350,
              border: `1px solid ${colors.border}`
            }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ color: colors.text, mb: 1 }}>
                {isInstructor && endSessionForAll 
                  ? 'Ending Session...' 
                  : 'Leaving Session...'
                }
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                {isInstructor && endSessionForAll 
                  ? 'Notifying all participants and saving session data...' 
                  : 'Saving your progress and disconnecting...'
                }
              </Typography>
              <LinearProgress sx={{ mt: 2 }} />
            </Paper>
          </Box>
        )}

        {/* Session status indicator */}
        <Box sx={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 1000
        }}>
          <Chip
            icon={
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  animation: 'pulse 2s infinite'
                }}
              />
            }
            label="Live"
            color="success"
            size="small"
            sx={{
              bgcolor: colors.paper,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              boxShadow: 2,
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(0.95)',
                  boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)'
                },
                '70%': {
                  transform: 'scale(1)',
                  boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)'
                },
                '100%': {
                  transform: 'scale(0.95)',
                  boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)'
                }
              }
            }}
          />
        </Box>

        {/* Connection status */}
        <Box sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000
        }}>
          <Chip
            icon={
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'success.main'
                }}
              />
            }
            label={`Connected • ${participants.length || sessionToDisplay.participantCount || 0} online`}
            size="small"
            sx={{
              bgcolor: colors.paper,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              boxShadow: 1
            }}
          />
        </Box>

        {/* Current User Info */}
        <Box sx={{
          position: 'fixed',
          top: 70,
          right: 20,
          zIndex: 1000
        }}>
          <Chip
            avatar={
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                H
              </Avatar>
            }
            label="Huy-VNNIC"
            size="small"
            sx={{
              bgcolor: colors.paper,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              boxShadow: 1
            }}
          />
        </Box>

        {/* Time display */}
        <Box sx={{
          position: 'fixed',
          top: 120,
          right: 20,
          zIndex: 1000
        }}>
          <Chip
            label={new Date().toLocaleTimeString()}
            size="small"
            sx={{
              bgcolor: colors.paper,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              boxShadow: 1,
              fontFamily: 'monospace'
            }}
          />
        </Box>

        {/* Keyboard shortcuts info */}
        <Box sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 1000
        }}>
          <Tooltip 
            title={
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Keyboard Shortcuts:</Typography>
                <Typography variant="caption" display="block">Ctrl + Enter: Run Code</Typography>
                <Typography variant="caption" display="block">Ctrl + S: Save Notes</Typography>
                <Typography variant="caption" display="block">Ctrl + /: Toggle Theme</Typography>
                <Typography variant="caption" display="block">Ctrl + L: Leave Session</Typography>
                <Typography variant="caption" display="block">Tab: Switch Tabs</Typography>
                <Typography variant="caption" display="block">Esc: Close Dialogs</Typography>
                <Typography variant="caption" display="block">Double-click Leave: Emergency Exit</Typography>
              </Box>
            }
            placement="top"
            arrow
          >
            <Chip
              label="⌨️ Shortcuts"
              size="small"
              sx={{
                bgcolor: colors.paper,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                cursor: 'help',
                '&:hover': {
                  bgcolor: 'primary.light',
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Tooltip>
        </Box>
      </Container>

      {/* Global keyboard shortcuts handler */}
      <Box
        sx={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        tabIndex={0}
        onKeyDown={(e) => {
          // Ctrl + Enter: Run code
          if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (activeTab === 0) {
              handleRunCode();
            }
          }
          // Ctrl + S: Save notes
          if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (personalNotes) {
              localStorage.setItem(`notes-${id}`, personalNotes);
              showSnackbar('Notes saved', 'success');
            }
          }
          // Ctrl + /: Toggle theme
          if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            setThemeMode(theme_mode === 'dark' ? 'light' : 'dark');
          }
          // Ctrl + L: Leave session
          if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            if (!isLeavingSession) {
              handleLeaveSession();
            }
          }
          // Tab key: Switch tabs
          if (e.key === 'Tab' && !e.ctrlKey && !e.shiftKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            setActiveTab((prev) => (prev + 1) % (isInstructor ? 5 : 4));
          }
          // Esc key: Close dialogs and emergency exit
          if (e.key === 'Escape') {
            if (showConfirmLeave) {
              if (isLeavingSession) {
                // Emergency exit on Esc during leaving
                emergencyLeave();
              } else {
                cancelLeave();
              }
            }
            if (showSettings) setShowSettings(false);
            if (showParticipants) setShowParticipants(false);
            if (emojiAnchor) setEmojiAnchor(null);
          }
        }}
      />
    </Box>
  );
};

export default LiveSessionPage;