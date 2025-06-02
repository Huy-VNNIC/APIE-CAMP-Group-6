import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  IconButton,
  Chip,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PanToolIcon from '@mui/icons-material/PanTool';
import NotificationsIcon from '@mui/icons-material/Notifications';

const InstructorSessionView = ({ sessions, onShareSession, onDeleteSession, onEndSession }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  
  const handleMenuOpen = (event, session) => {
    setAnchorEl(event.currentTarget);
    setSelectedSession(session);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleJoinSession = (sessionId) => {
    handleMenuClose();
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      // Store session info in localStorage for persistence
      localStorage.setItem('joinedSession', JSON.stringify({
        id: sessionId,
        role: 'instructor',
        joinedAt: new Date().toISOString()
      }));
      
      // Navigate to the live session page
      navigate(`/live-session/${sessionId}`);
    }
  };
  
  const handleShare = () => {
    handleMenuClose();
    if (onShareSession && selectedSession) {
      onShareSession(selectedSession);
    }
  };
  
  const handleEdit = () => {
    handleMenuClose();
    // Implement edit functionality
    alert(`Editing session: ${selectedSession.title}`);
  };
  
  const handleEnd = () => {
    handleMenuClose();
    if (onEndSession && selectedSession) {
      onEndSession(selectedSession);
    }
  };
  
  const handleDelete = () => {
    handleMenuClose();
    if (onDeleteSession && selectedSession) {
      onDeleteSession(selectedSession);
    }
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!sessions || sessions.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          You haven't created any sessions yet. Create a new session to get started.
        </Typography>
      </Paper>
    );
  }
  
  const activeSessions = sessions.filter(s => s.status !== 'ended');
  const endedSessions = sessions.filter(s => s.status === 'ended');
  
  return (
    <Box>
      {activeSessions.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Active Sessions
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {activeSessions.map(session => (
              <Grid item xs={12} md={6} lg={4} key={session.id}>
                <Card>
                  <CardContent sx={{ pb: 1, position: 'relative' }}>
                    <Tooltip title="Session options">
                      <IconButton 
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={(e) => handleMenuOpen(e, session)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" noWrap sx={{ mr: 1, maxWidth: '80%' }}>
                        {session.title}
                      </Typography>
                      {session.hasPassword && (
                        <Tooltip title="Password protected">
                          <LockIcon fontSize="small" color="action" />
                        </Tooltip>
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                      Started at {formatTime(session.startTime)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', my: 1 }}>
                      <Chip 
                        size="small" 
                        label={`${session.participantCount} participants`}
                        icon={<PersonAddIcon fontSize="small" />}
                        color="primary"
                        variant="outlined"
                      />
                      
                      <Badge badgeContent={2} color="warning">
                        <Chip 
                          size="small" 
                          label="Questions"
                          icon={<PanToolIcon fontSize="small" />}
                          variant="outlined"
                        />
                      </Badge>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
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
        </>
      )}
      
      {endedSessions.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Past Sessions
          </Typography>
          
          <Grid container spacing={3}>
            {endedSessions.map(session => (
              <Grid item xs={12} md={6} lg={4} key={session.id}>
                <Card sx={{ opacity: 0.8 }}>
                  <CardContent sx={{ pb: 1, position: 'relative' }}>
                    <IconButton 
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={(e) => handleMenuOpen(e, session)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    
                    <Typography variant="h6" gutterBottom noWrap>
                      {session.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Ended • {formatTime(session.startTime)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                      <Chip 
                        size="small" 
                        label={`${session.participantCount} attended`}
                        icon={<PersonAddIcon fontSize="small" />}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="outlined"
                      fullWidth
                      startIcon={<ShareIcon />}
                      onClick={() => {
                        setSelectedSession(session);
                        handleShare();
                      }}
                    >
                      Share Recording
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {/* Session Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedSession && selectedSession.status !== 'ended' && (
          <MenuItem onClick={() => handleJoinSession(selectedSession.id)}>
            <ListItemIcon>
              <PlayArrowIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Join Session</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share Invite</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Details</ListItemText>
        </MenuItem>
        <Divider />
        {selectedSession && selectedSession.status !== 'ended' && (
          <MenuItem onClick={handleEnd}>
            <ListItemIcon>
              <StopIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>End Session</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default InstructorSessionView;
