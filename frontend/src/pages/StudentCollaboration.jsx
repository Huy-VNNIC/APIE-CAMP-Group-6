import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItem,
  List,
  ListItemText,
  ListItemAvatar,
  Chip,
  Badge
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Icons
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatIcon from '@mui/icons-material/Chat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TodayIcon from '@mui/icons-material/Today';

// Services
import { 
  getCoursePeers, 
  requestCollaboration,
  getCollaborationRequests,
  respondToCollaborationRequest
} from '../services/studentService';

const StudentCollaboration = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const [peers, setPeers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [collaborationRequests, setCollaborationRequests] = useState({ sent: [], received: [] });
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [collaborationForm, setCollaborationForm] = useState({
    topic: '',
    description: '',
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // Default to tomorrow
  });
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    // Load courses - in a real app, this would come from API
    setCourses([
      { id: 'course1', name: 'Introduction to Programming' },
      { id: 'course2', name: 'Web Development Fundamentals' },
      { id: 'course3', name: 'Data Structures and Algorithms' }
    ]);
    
    // Load collaboration requests
    const fetchCollaborationRequests = async () => {
      try {
        const response = await getCollaborationRequests();
        setCollaborationRequests(response.data);
      } catch (err) {
        console.error('Error fetching collaboration requests:', err);
        setError('Failed to load collaboration requests');
      }
    };
    
    fetchCollaborationRequests();
    setLoading(false);
  }, []);
  
  // When selected course changes
  useEffect(() => {
    if (!selectedCourse) {
      setPeers([]);
      return;
    }
    
    const fetchPeers = async () => {
      try {
        setLoading(true);
        const response = await getCoursePeers(selectedCourse);
        setPeers(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching peers:', err);
        setError('Failed to load peers for this course');
        setLoading(false);
      }
    };
    
    fetchPeers();
  }, [selectedCourse]);
  
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
  
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };
  
  const handleOpenDialog = (peer) => {
    setSelectedPeer(peer);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPeer(null);
  };
  
  const handleCollaborationFormChange = (field) => (event) => {
    setCollaborationForm({
      ...collaborationForm,
      [field]: event.target.value
    });
  };
  
  const handleDateTimeChange = (newValue) => {
    setCollaborationForm({
      ...collaborationForm,
      scheduledTime: newValue
    });
  };
  
  const handleSubmitCollaborationRequest = async () => {
    if (!selectedPeer || !collaborationForm.topic) return;
    
    try {
      setSubmitting(true);
      
      await requestCollaboration(
        selectedPeer.id,
        selectedCourse,
        collaborationForm.topic,
        collaborationForm.description,
        collaborationForm.scheduledTime.toISOString()
      );
      
      // Refresh collaboration requests
      const response = await getCollaborationRequests();
      setCollaborationRequests(response.data);
      
      setSubmitting(false);
      setOpenDialog(false);
      setSelectedPeer(null);
      
      // Reset form
      setCollaborationForm({
        topic: '',
        description: '',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      
    } catch (err) {
      console.error('Error submitting collaboration request:', err);
      setError('Failed to send collaboration request. Please try again.');
      setSubmitting(false);
    }
  };
  
  const handleRespondToRequest = async (requestId, response) => {
    try {
      await respondToCollaborationRequest(requestId, response);
      
      // Refresh collaboration requests
      const updatedResponse = await getCollaborationRequests();
      setCollaborationRequests(updatedResponse.data);
      
    } catch (err) {
      console.error('Error responding to collaboration request:', err);
      setError('Failed to respond to request. Please try again.');
    }
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getStatusChip = (status) => {
    switch(status) {
      case 'accepted':
        return <Chip icon={<CheckCircleIcon />} label={t('collaboration.accepted')} color="success" size="small" />;
      case 'rejected':
        return <Chip icon={<CancelIcon />} label={t('collaboration.rejected')} color="error" size="small" />;
      case 'pending':
        return <Chip icon={<AccessTimeIcon />} label={t('collaboration.pending')} color="primary" variant="outlined" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('collaboration.title')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('collaboration.description')}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tab} 
            onChange={handleTabChange} 
            aria-label="collaboration tabs"
            variant="fullWidth"
          >
            <Tab 
              label={t('collaboration.tabs.findPeers')} 
              icon={<GroupIcon />} 
              iconPosition="start"
            />
            <Tab 
              label={t('collaboration.tabs.requests')} 
              icon={<EventIcon />} 
              iconPosition="start"
              iconPosition="start"
              icon={
                <Badge 
                  badgeContent={collaborationRequests?.received?.filter(r => r.status === 'pending').length || 0}
                  color="error"
                >
                  <EventIcon />
                </Badge>
              }
            />
          </Tabs>
        </Box>
        
        {/* Find Peers Tab */}
        {tab === 0 && (
          <Box p={3}>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="course-select-label">
                  {t('collaboration.selectCourse')}
                </InputLabel>
                <Select
                  labelId="course-select-label"
                  id="course-select"
                  value={selectedCourse}
                  label={t('collaboration.selectCourse')}
                  onChange={handleCourseChange}
                >
                  {courses.map(course => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : !selectedCourse ? (
              <Alert severity="info">
                {t('collaboration.selectCoursePrompt')}
              </Alert>
            ) : peers.length === 0 ? (
              <Alert severity="info">
                {t('collaboration.noPeersFound')}
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {peers.map(peer => (
                  <Grid item xs={12} sm={6} md={4} key={peer.id}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: peer.isOnline ? 'success.main' : 'grey.500' }}>
                            {peer.avatar || peer.name.charAt(0)}
                          </Avatar>
                          <Box ml={2}>
                            <Typography variant="h6">{peer.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {peer.isOnline ? t('collaboration.online') : t('collaboration.offline')}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box mb={2}>
                          <Typography variant="body2" gutterBottom>
                            <strong>{t('collaboration.progress')}:</strong> {peer.progress}%
                          </Typography>
                          <Typography variant="body2">
                            <strong>{t('collaboration.lastActive')}:</strong> {' '}
                            {new Date(peer.lastActive).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button 
                          fullWidth 
                          variant="contained"
                          onClick={() => handleOpenDialog(peer)}
                        >
                          {t('collaboration.requestCollaboration')}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
        
        {/* Requests Tab */}
        {tab === 1 && (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              {t('collaboration.receivedRequests')}
            </Typography>
            
            {collaborationRequests?.received?.length > 0 ? (
              <List>
                {collaborationRequests.received.map(request => (
                  <Paper 
                    key={request._id} 
                    elevation={2} 
                    sx={{ mb: 2, overflow: 'hidden' }}
                  >
                    <Box p={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box display="flex" alignItems="center">
                          <ListItemAvatar>
                            <Avatar>
                              {request.initiator?.fullName?.charAt(0) || 
                                request.initiator?.username?.charAt(0) || 'S'}
                            </Avatar>
                          </ListItemAvatar>
                          <Box>
                            <Typography variant="subtitle1">
                              {request.initiator?.fullName || request.initiator?.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.course?.title || 'Unknown Course'}
                            </Typography>
                          </Box>
                        </Box>
                        {getStatusChip(request.status)}
                      </Box>
                      
                      <Box mt={2}>
                        <Typography variant="subtitle1" gutterBottom>
                          {request.topic}
                        </Typography>
                        
                        {request.description && (
                          <Typography variant="body2" paragraph>
                            {request.description}
                          </Typography>
                        )}
                        
                        <Box display="flex" alignItems="center" mt={1} color="text.secondary">
                          <TodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2">
                            {formatDateTime(request.scheduledTime)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {request.status === 'pending' && (
                        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                          <Button 
                            variant="outlined" 
                            color="error"
                            onClick={() => handleRespondToRequest(request._id, 'rejected')}
                          >
                            {t('collaboration.decline')}
                          </Button>
                          <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => handleRespondToRequest(request._id, 'accepted')}
                          >
                            {t('collaboration.accept')}
                          </Button>
                        </Box>
                      )}
                      
                      {request.status === 'accepted' && request.meetingLink && (
                        <Box mt={2} display="flex" justifyContent="flex-end">
                          <Button 
                            variant="contained" 
                            color="primary"
                            startIcon={<VideocamIcon />}
                            href={request.meetingLink}
                            target="_blank"
                          >
                            {t('collaboration.joinMeeting')}
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                {t('collaboration.noReceivedRequests')}
              </Alert>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              {t('collaboration.sentRequests')}
            </Typography>
            
            {collaborationRequests?.sent?.length > 0 ? (
              <List>
                {collaborationRequests.sent.map(request => (
                  <Paper 
                    key={request._id} 
                    elevation={2} 
                    sx={{ mb: 2, overflow: 'hidden' }}
                  >
                    <Box p={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box display="flex" alignItems="center">
                          <ListItemAvatar>
                            <Avatar>
                              {request.invitedPeer?.fullName?.charAt(0) || 
                                request.invitedPeer?.username?.charAt(0) || 'S'}
                            </Avatar>
                          </ListItemAvatar>
                          <Box>
                            <Typography variant="subtitle1">
                              {request.invitedPeer?.fullName || request.invitedPeer?.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.course?.title || 'Unknown Course'}
                            </Typography>
                          </Box>
                        </Box>
                        {getStatusChip(request.status)}
                      </Box>
                      
                      <Box mt={2}>
                        <Typography variant="subtitle1" gutterBottom>
                          {request.topic}
                        </Typography>
                        
                        {request.description && (
                          <Typography variant="body2" paragraph>
                            {request.description}
                          </Typography>
                        )}
                        
                        <Box display="flex" alignItems="center" mt={1} color="text.secondary">
                          <TodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2">
                            {formatDateTime(request.scheduledTime)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {request.status === 'accepted' && request.meetingLink && (
                        <Box mt={2} display="flex" justifyContent="flex-end">
                          <Button 
                            variant="contained" 
                            color="primary"
                            startIcon={<VideocamIcon />}
                            href={request.meetingLink}
                            target="_blank"
                          >
                            {t('collaboration.joinMeeting')}
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                {t('collaboration.noSentRequests')}
              </Alert>
            )}
          </Box>
        )}
      </Paper>
      
      {/* Collaboration Request Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {t('collaboration.requestCollaborationWith')} {selectedPeer?.name}
        </DialogTitle>
        <DialogContent>
          <Box mb={3} mt={1}>
            <TextField
              label={t('collaboration.topic')}
              fullWidth
              required
              value={collaborationForm.topic}
              onChange={handleCollaborationFormChange('topic')}
              margin="normal"
            />
            
            <TextField
              label={t('collaboration.description')}
              fullWidth
              multiline
              rows={3}
              value={collaborationForm.description}
              onChange={handleCollaborationFormChange('description')}
              margin="normal"
            />
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label={t('collaboration.scheduledTime')}
                value={collaborationForm.scheduledTime}
                onChange={handleDateTimeChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    margin="normal"
                  />
                )}
                minDate={new Date()}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="contained"
            color="primary"
            onClick={handleSubmitCollaborationRequest}
            disabled={!collaborationForm.topic || submitting}
          >
            {submitting ? t('common.sending') : t('collaboration.sendRequest')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentCollaboration;
