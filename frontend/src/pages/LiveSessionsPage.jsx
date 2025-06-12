import React, { useState, useEffect } from 'react';
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
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Switch,
  FormGroup,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PanToolIcon from '@mui/icons-material/PanTool';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RefreshIcon from '@mui/icons-material/Refresh';
import TodayIcon from '@mui/icons-material/Today';
import HistoryIcon from '@mui/icons-material/History';

import CreateSessionDialog from '../components/CreateSessionDialog';
import SessionShareDialog from '../components/SessionShareDialog';

// Sample course data
const courses = [
  { id: '1', title: 'JavaScript Fundamentals', category: 'Web Development' },
  { id: '2', title: 'Python for Beginners', category: 'Programming' },
  { id: '3', title: 'Advanced React', category: 'Web Development' },
  { id: '4', title: 'Node.js & Express', category: 'Web Development' },
  { id: '5', title: 'Data Structures in Java', category: 'Computer Science' },
  { id: '6', title: 'Machine Learning Basics', category: 'Data Science' }
];

// Mock data for sessions with enhanced features
const initialSessions = [
  {
    id: 'session-abc123',
    title: 'JavaScript Functions Workshop',
    courseId: '1',
    instructorName: 'John Smith',
    participantCount: 5,
    startTime: new Date().toISOString(),
    hasPassword: true,
    password: 'demo123',
    category: 'Web Development',
    tags: ['javascript', 'functions', 'beginner'],
    status: 'active',
    handRaisedCount: 2,
    description: 'Learn about JavaScript functions, closures, and function expressions.',
    estimatedDuration: 60 // minutes
  },
  {
    id: 'session-def456',
    title: 'React Hooks Deep Dive',
    courseId: '3',
    instructorName: 'Sarah Johnson',
    participantCount: 12,
    startTime: new Date(Date.now() - 30 * 60000).toISOString(),
    hasPassword: false,
    category: 'Web Development',
    tags: ['react', 'hooks', 'intermediate'],
    status: 'active',
    handRaisedCount: 0,
    description: 'Exploring React hooks and advanced component patterns.',
    estimatedDuration: 90 // minutes
  },
  {
    id: 'session-ghi789',
    title: 'Python Data Analysis',
    courseId: '2',
    instructorName: 'Michael Chen',
    participantCount: 8,
    startTime: new Date(Date.now() + 60 * 60000).toISOString(), // 1 hour in the future
    hasPassword: true,
    password: 'python123',
    category: 'Data Science',
    tags: ['python', 'pandas', 'data analysis', 'intermediate'],
    status: 'scheduled',
    handRaisedCount: 0,
    description: 'Work with real-world datasets using Python and Pandas.',
    estimatedDuration: 120 // minutes
  },
  {
    id: 'session-jkl012',
    title: 'Algorithms Workshop',
    courseId: '5',
    instructorName: 'John Smith',
    participantCount: 0,
    startTime: new Date(Date.now() + 2 * 60 * 60000).toISOString(), // 2 hours in the future
    hasPassword: false,
    category: 'Computer Science',
    tags: ['algorithms', 'data structures', 'advanced'],
    status: 'scheduled',
    handRaisedCount: 0,
    description: 'Advanced algorithms and problem-solving techniques.',
    estimatedDuration: 120 // minutes
  }
];

const LiveSessionsPage = () => {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState(initialSessions);
  const [activeTab, setActiveTab] = useState(0);
  
  // New state for enhanced features
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [favoriteSessionIds, setFavoriteSessionIds] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sessionDetailsOpen, setSessionDetailsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(2);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // For demo purposes, assume we're the instructor named "John Smith"
  const user = { 
    role: 'instructor', 
    username: 'instructor',
    fullName: 'John Smith' 
  };

  // Effect to simulate loading data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSessions(initialSessions);
      setIsLoading(false);
    };
    
    loadInitialData();
    
    // Load favorites from localStorage if available
    const savedFavorites = localStorage.getItem('favoriteSessionIds');
    if (savedFavorites) {
      setFavoriteSessionIds(JSON.parse(savedFavorites));
    }
  }, []);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Create new session
  const handleCreateSession = () => {
    setCreateDialogOpen(true);
  };
  
  // Handle session created
  const handleSessionCreated = (newSession) => {
    // Add the new session to our list with enhanced properties
    const enhancedSession = {
      ...newSession,
      participantCount: 1,
      startTime: new Date().toISOString(),
      instructorName: user.fullName,
      category: courses.find(c => c.id === newSession.courseId)?.category || 'Uncategorized',
      tags: [],
      status: 'active',
      handRaisedCount: 0,
      estimatedDuration: 60
    };
    
    setSessions([...sessions, enhancedSession]);
    setCreateDialogOpen(false);
    setSelectedSession(enhancedSession);
    setShareDialogOpen(true);
    
    // Show notification
    setSnackbarMessage('New session created successfully!');
    setSnackbarSeverity('success');
    setShowSnackbar(true);
  };
  
  // Join a session
  const handleJoinSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      // Determine if the user is the instructor
      const isInstructor = session.instructorName === user.fullName;
      
      // Store the session info in localStorage
      localStorage.setItem('joinedSession', JSON.stringify({
        id: sessionId,
        role: isInstructor ? 'instructor' : 'student',
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
  
  // New functions for enhanced features
  
  // Toggle favorite status
  const handleToggleFavorite = (sessionId) => {
    let newFavorites;
    
    if (favoriteSessionIds.includes(sessionId)) {
      newFavorites = favoriteSessionIds.filter(id => id !== sessionId);
      setSnackbarMessage('Session removed from favorites');
    } else {
      newFavorites = [...favoriteSessionIds, sessionId];
      setSnackbarMessage('Session added to favorites');
    }
    
    setFavoriteSessionIds(newFavorites);
    localStorage.setItem('favoriteSessionIds', JSON.stringify(newFavorites));
    setSnackbarSeverity('success');
    setShowSnackbar(true);
  };
  
  // Refresh sessions list
  const handleRefreshSessions = async () => {
    setIsLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // You would typically fetch fresh data from an API here
    // For demo, just update one of the sessions to show a change
    const updatedSessions = sessions.map(session => {
      if (session.id === 'session-abc123') {
        return {
          ...session,
          participantCount: session.participantCount + 1,
          handRaisedCount: 3 // Increased
        };
      }
      return session;
    });
    
    setSessions(updatedSessions);
    setIsLoading(false);
    
    // Show notification
    setSnackbarMessage('Sessions refreshed successfully');
    setSnackbarSeverity('info');
    setShowSnackbar(true);
  };
  
  // Open detailed view of a session
  const handleViewSessionDetails = (session) => {
    setSelectedSession(session);
    setSessionDetailsOpen(true);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setSortOption('newest');
    setShowOnlyFavorites(false);
    
    // Show notification
    setSnackbarMessage('Filters cleared');
    setSnackbarSeverity('info');
    setShowSnackbar(true);
  };
  
  // Handle notifications
  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    
    if (notificationCount > 0) {
      setNotificationCount(0);
    }
  };
  
  // Join session as instructor (for testing)
  const handleJoinAsInstructor = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      localStorage.setItem('joinedSession', JSON.stringify({
        id: sessionId,
        role: 'instructor',
        password: session.password,
        joinedAt: new Date().toISOString()
      }));
      
      navigate(`/live-session/${sessionId}`);
    }
  };
  
  // Join session as student (for testing)
  const handleJoinAsStudent = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      localStorage.setItem('joinedSession', JSON.stringify({
        id: sessionId,
        role: 'student',
        password: session.password,
        joinedAt: new Date().toISOString()
      }));
      
      navigate(`/live-session/${sessionId}`);
    }
  };

  // Filter and sort sessions
  const filterAndSortSessions = () => {
    return sessions
      .filter(session => {
        // Search term filter
        const matchesSearch = !searchTerm || 
          session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (session.description && session.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Category filter
        const matchesCategory = categoryFilter === 'all' || 
          session.category === categoryFilter;
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || 
          session.status === statusFilter;
        
        // Favorites filter
        const matchesFavorites = !showOnlyFavorites || 
          favoriteSessionIds.includes(session.id);
        
        return matchesSearch && matchesCategory && matchesStatus && matchesFavorites;
      })
      .sort((a, b) => {
        // Sort by selected option
        switch (sortOption) {
          case 'newest':
            return new Date(b.startTime) - new Date(a.startTime);
          case 'oldest':
            return new Date(a.startTime) - new Date(b.startTime);
          case 'participants':
            return b.participantCount - a.participantCount;
          case 'title':
            return a.title.localeCompare(b.title);
          case 'handRaised':
            return b.handRaised - a.handRaised;
          default:
            return 0;
        }
      });
  };
  
  // Filter sessions relevant to the current user
  const userSessions = sessions.filter(
    session => user.role === 'instructor' ? 
      session.instructorName === user.fullName : 
      true
  );
  
  // Get filtered and sorted sessions based on all criteria
  const filteredSessions = activeTab === 0 ? 
    filterAndSortSessions() : 
    filterAndSortSessions().filter(session => session.instructorName === user.fullName);
  
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
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Notification badge */}
          <Tooltip title="Notifications">
            <IconButton 
              color={showNotifications ? "primary" : "default"}
              onClick={handleToggleNotifications}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Refresh button */}
          <Tooltip title="Refresh Sessions">
            <IconButton 
              onClick={handleRefreshSessions}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          
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
      </Box>
      
      {/* Search and filters area */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Sessions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
              placeholder="Search by title, instructor, or description..."
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Web Development">Web Development</MenuItem>
                <MenuItem value="Programming">Programming</MenuItem>
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<FilterListIcon />}
                onClick={() => setFilterDialogOpen(true)}
              >
                More Filters
              </Button>
              
              <Tooltip title="Clear all filters">
                <IconButton 
                  color="default" 
                  onClick={handleClearFilters}
                  size="small"
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyFavorites}
                    onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show only favorites"
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SortIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    label="Sort by"
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="participants">Most Participants</MenuItem>
                    <MenuItem value="title">Title (A-Z)</MenuItem>
                    <MenuItem value="handRaised">Most Questions (Hands Raised)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="All Sessions" />
          {user.role === 'instructor' && <Tab label="My Sessions" />}
        </Tabs>
      </Paper>
      
      {/* Sessions List */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredSessions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No sessions match your filters.
          </Typography>
          {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || showOnlyFavorites) && (
            <Button
              variant="text"
              color="primary"
              onClick={handleClearFilters}
              sx={{ mt: 1 }}
            >
              Clear filters
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredSessions.map(session => {
            const isFavorite = favoriteSessionIds.includes(session.id);
            const isScheduled = new Date(session.startTime) > new Date();
            const isActive = session.status === 'active';
            
            return (
              <Grid item xs={12} md={6} lg={4} key={session.id}>
                <Card sx={{ position: 'relative' }}>
                  {/* Favorite button */}
                  <IconButton
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                    onClick={() => handleToggleFavorite(session.id)}
                    color={isFavorite ? "error" : "default"}
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  
                  <CardContent>
                    <Typography variant="h6" noWrap sx={{ pr: 4 }}>
                      {session.title}
                      {session.hasPassword && (
                        <LockIcon fontSize="small" color="action" sx={{ ml: 1, verticalAlign: 'middle' }} />
                      )}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Instructor: {session.instructorName}
                    </Typography>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip 
                        icon={<PersonIcon />}
                        label={`${session.participantCount} participants`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      
                      {isScheduled ? (
                        <Chip
                          icon={<TodayIcon />}
                          label={`Starts at ${formatTime(session.startTime)}`}
                          size="small"
                          color="warning"
                        />
                      ) : (
                        <Chip
                          icon={<HistoryIcon />}
                          label={`Started at ${formatTime(session.startTime)}`}
                          size="small"
                          color={isActive ? "success" : "default"}
                        />
                      )}
                    </Box>
                    
                    {/* Session description */}
                    <Typography variant="body2" sx={{ mt: 1, minHeight: 40 }}>
                      {session.description && session.description.length > 75
                        ? `${session.description.substring(0, 75)}...`
                        : session.description}
                    </Typography>
                    
                    {/* Tags and categories */}
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      <Chip 
                        label={session.category} 
                        size="small" 
                        color="secondary"
                      />
                      {session.tags && session.tags.slice(0, 2).map(tag => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    
                    {/* Hand raised indicator */}
                    {session.handRaisedCount > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                        <PanToolIcon color="secondary" fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="secondary">
                          {session.handRaisedCount} students have questions
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ flexDirection: 'column', gap: 1, p: 2, pt: 0 }}>
                    {/* Main action button */}
                    <Button 
                      variant="contained" 
                      color="primary"
                      fullWidth
                      onClick={() => handleJoinSession(session.id)}
                      disabled={isScheduled}
                    >
                      {isScheduled ? `Starts in ${Math.round((new Date(session.startTime) - new Date()) / 60000)} minutes` : "Join Session"}
                    </Button>
                    
                    {/* Secondary actions */}
                    <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleViewSessionDetails(session)}
                        fullWidth
                      >
                        Details
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        size="small"
                        color="secondary"
                        onClick={() => handleJoinAsInstructor(session.id)}
                        fullWidth
                      >
                        Join as Instructor
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        size="small"
                        color="info"
                        onClick={() => handleJoinAsStudent(session.id)}
                        fullWidth
                      >
                        Join as Student
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
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
      
      {/* Advanced Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Advanced Filters</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  label="Sort by"
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="participants">Most Participants</MenuItem>
                  <MenuItem value="title">Title (A-Z)</MenuItem>
                  <MenuItem value="handRaised">Most Questions (Hands Raised)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="Web Development">Web Development</MenuItem>
                  <MenuItem value="Programming">Programming</MenuItem>
                  <MenuItem value="Computer Science">Computer Science</MenuItem>
                  <MenuItem value="Data Science">Data Science</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showOnlyFavorites}
                      onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Show only favorites"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilters} color="error">Clear Filters</Button>
          <Button onClick={() => setFilterDialogOpen(false)}>Close</Button>
          <Button 
            onClick={() => {
              setFilterDialogOpen(false);
              setSnackbarMessage('Filters applied');
              setSnackbarSeverity('success');
              setShowSnackbar(true);
            }} 
            variant="contained"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Session Details Dialog */}
      {selectedSession && (
        <Dialog
          open={sessionDetailsOpen}
          onClose={() => setSessionDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedSession.title}
            {selectedSession.hasPassword && (
              <LockIcon fontSize="small" color="action" sx={{ ml: 1, verticalAlign: 'middle' }} />
            )}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Session Information</Typography>
                
                <Typography variant="body1" paragraph>
                  {selectedSession.description}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip label={selectedSession.category} color="secondary" />
                  {selectedSession.tags && selectedSession.tags.map(tag => (
                    <Chip key={tag} label={tag} variant="outlined" />
                  ))}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>Key Details</Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Instructor:
                    </Typography>
                    <Typography variant="body1">
                      {selectedSession.instructorName}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Started At:
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedSession.startTime).toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip 
                      label={selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)} 
                      color={selectedSession.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Expected Duration:
                    </Typography>
                    <Typography variant="body1">
                      {selectedSession.estimatedDuration} minutes
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Participants</Typography>
                
                <Paper variant="outlined" sx={{ p: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      <strong>{selectedSession.participantCount}</strong> participants
                    </Typography>
                    
                    {selectedSession.handRaisedCount > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PanToolIcon color="secondary" fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="secondary">
                          {selectedSession.handRaisedCount} raised
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
                
                <Typography variant="subtitle1" gutterBottom>Join Options</Typography>
                
                {selectedSession.hasPassword && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    This session requires a password to join.
                  </Alert>
                )}
                
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mb: 1 }}
                  onClick={() => {
                    handleJoinSession(selectedSession.id);
                    setSessionDetailsOpen(false);
                  }}
                  disabled={new Date(selectedSession.startTime) > new Date()}
                >
                  Join Session
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    color="secondary"
                    onClick={() => {
                      handleJoinAsInstructor(selectedSession.id);
                      setSessionDetailsOpen(false);
                    }}
                    fullWidth
                  >
                    Join as Instructor
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    size="small"
                    color="info"
                    onClick={() => {
                      handleJoinAsStudent(selectedSession.id);
                      setSessionDetailsOpen(false);
                    }}
                    fullWidth
                  >
                    Join as Student 
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSessionDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Snackbar notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LiveSessionsPage;