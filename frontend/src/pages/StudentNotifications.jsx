import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  FormControlLabel,
  Switch,
  TextField,
  InputAdornment
} from '@mui/material';
import StudentLayout from '../components/StudentLayout';
import { useTranslation } from 'react-i18next';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

// Services
import { getStudentNotifications, markNotificationAsRead } from '../services/studentService';

const StudentNotifications = () => {
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getStudentNotifications();
        setNotifications(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);
  
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      // Update notifications in state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read. Please try again.');
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      // In a real app, you would implement a batch API endpoint
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
      
      // For now, we'll mark them one by one
      const markPromises = unreadIds.map(id => markNotificationAsRead(id));
      await Promise.all(markPromises);
      
      // Update notifications in state
      setNotifications(notifications.map(notification => ({ 
        ...notification, 
        isRead: true 
      })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read. Please try again.');
    }
  };
  
  // Filter notifications based on search and unread filter
  const filteredNotifications = notifications
    .filter(notification => {
      const matchesSearch = searchQuery === '' || 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (notification.courseName && 
         notification.courseName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch && (showUnreadOnly ? !notification.isRead : true);
    });
  
  const getNotificationTypeLabel = (type) => {
    switch(type) {
      case 'deadline':
        return t('notifications.deadline');
      case 'announcement':
        return t('notifications.announcement');
      case 'grade':
        return t('notifications.grade');
      case 'message':
        return t('notifications.message');
      default:
        return t('notifications.system');
    }
  };
  
  const getNotificationTypeColor = (type) => {
    switch(type) {
      case 'deadline':
        return 'error';
      case 'announcement':
        return 'info';
      case 'grade':
        return 'success';
      case 'message':
        return 'secondary';
      default:
        return 'default';
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <StudentLayout notificationCount={notifications.filter(n => !n.isRead).length}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('notifications.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('notifications.description')}
          </Typography>
        </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Search and filters */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <TextField
            placeholder={t('notifications.search')}
            size="small"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '60%' }}
          />
          
          <Box display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Switch 
                  checked={showUnreadOnly}
                  onChange={() => setShowUnreadOnly(!showUnreadOnly)}
                  color="primary"
                />
              }
              label={t('notifications.unreadOnly')}
            />
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {/* Notifications count and actions */}
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between" 
          mb={2}
          px={1}
        >
          <Box display="flex" alignItems="center">
            <NotificationsIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {filteredNotifications.length} {t('notifications.total')} • {' '}
              {notifications.filter(n => !n.isRead).length} {t('notifications.unread')}
            </Typography>
          </Box>
          
          <Button 
            size="small" 
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(n => !n.isRead)}
          >
            {t('notifications.markAllRead')}
          </Button>
        </Box>
        
        {/* Notifications list */}
        {filteredNotifications.length > 0 ? (
          <List disablePadding>
            {filteredNotifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ 
                    px: 1, 
                    py: 2,
                    bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <Box width="100%">
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Box display="flex" alignItems="center">
                        {!notification.isRead && (
                          <Box 
                            component="span"
                            sx={{
                              display: 'inline-block',
                              width: 10,
                              height: 10,
                              bgcolor: 'primary.main',
                              borderRadius: '50%',
                              mr: 1.5
                            }}
                          />
                        )}
                        <Typography variant="subtitle1" component="span" fontWeight={notification.isRead ? 400 : 600}>
                          {notification.title}
                        </Typography>
                        <Chip 
                          label={getNotificationTypeLabel(notification.type)}
                          size="small"
                          color={getNotificationTypeColor(notification.type)}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(notification.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mt: 1, ml: notification.isRead ? 0 : 2.5 }}>
                      {notification.message}
                    </Typography>
                    
                    {notification.courseName && (
                      <Box mt={1} ml={notification.isRead ? 0 : 2.5}>
                        <Chip 
                          label={notification.courseName} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    )}
                    
                    {!notification.isRead && (
                      <Box display="flex" justifyContent="flex-end" mt={1}>
                        <Button 
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          {t('notifications.markRead')}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box py={4} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              {searchQuery || showUnreadOnly
                ? t('notifications.noMatchingNotifications')
                : t('notifications.noNotifications')
              }
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
    </StudentLayout>
  );
};

export default StudentNotifications;
