import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader, 
  Avatar,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
  Badge
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Services
import { getStudentDashboard, getStudentNotifications, markNotificationAsRead } from '../services/studentService';

// Charts component
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StudentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const dashboardResponse = await getStudentDashboard();
        setDashboardData(dashboardResponse.data);
        
        const notificationsResponse = await getStudentNotifications();
        const notificationData = notificationsResponse.data;
        setNotifications(notificationData);
        setNotificationCount(notificationData.filter(n => !n.isRead).length);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student dashboard:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboard();
    
    // Refresh data every 5 minutes
    const refreshInterval = setInterval(() => fetchDashboard(), 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  const handleNotificationRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      // Update notifications in state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      setNotificationCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  // Mock data for charts - in a real app this would come from dashboardData
  const weeklyActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Time Spent (minutes)',
        data: [45, 60, 35, 90, 50, 20, 30],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
        tension: 0.3
      }
    ]
  };
  
  const progressData = {
    labels: dashboardData?.activeCourses?.map(course => course.title) || [],
    datasets: [
      {
        label: 'Course Progress (%)',
        data: dashboardData?.activeCourses?.map(course => course.progress) || [],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main
        ],
      }
    ]
  };
  
  const quizPerformanceData = {
    labels: dashboardData?.recentQuizAttempts?.map(quiz => quiz.title) || [],
    datasets: [
      {
        label: 'Quiz Score (%)',
        data: dashboardData?.recentQuizAttempts?.map(quiz => quiz.score) || [],
        backgroundColor: theme.palette.info.light,
      }
    ]
  };
  
  return (
    <StudentLayout notificationCount={notificationCount}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('dashboard.welcome')}
            <Typography variant="h4" component="span" color="primary.main" sx={{ ml: 1 }}>
              {dashboardData?.studentInfo?.name || t('dashboard.student')}
            </Typography>
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {new Date().toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>
      
      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 140
            }}
          >
            <Box position="relative" display="inline-flex" sx={{ mb: 1 }}>
              <CircularProgress 
                variant="determinate" 
                value={dashboardData?.overallProgress || 0} 
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
                <Typography variant="h5" component="div" color="text.primary">
                  {dashboardData?.overallProgress || 0}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {t('dashboard.overallProgress')}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 140
            }}
          >
            <Box sx={{ mb: 1 }} display="flex" alignItems="center">
              <SchoolIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mr: 1 }} />
              <Typography variant="h5" component="div">
                {dashboardData?.enrolledCourses || 0}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" align="center">
              {t('dashboard.enrolledCourses')}
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center">
              {dashboardData?.completedCourses || 0} {t('dashboard.completed')}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 140
            }}
          >
            <Box sx={{ mb: 1 }} display="flex" alignItems="center">
              <EmojiEventsIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mr: 1 }} />
              <Typography variant="h5" component="div">
                {dashboardData?.streak || 0}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {t('dashboard.dayStreak')}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 140,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/notifications')}
          >
            <Box sx={{ mb: 1 }} display="flex" alignItems="center">
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon sx={{ fontSize: 40, color: theme.palette.info.main, mr: 1 }} />
              </Badge>
              <Typography variant="h5" component="div">
                {notifications.length}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {t('dashboard.notifications')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {notificationCount} {t('dashboard.unread')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Course Progress & Activities */}
        <Grid item xs={12} md={8}>
          {/* Active Courses */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                {t('dashboard.activeCourses')}
              </Typography>
              <Button size="small" onClick={() => navigate('/courses')} color="primary">
                {t('dashboard.viewAll')}
              </Button>
            </Box>
            
            {dashboardData?.activeCourses?.length > 0 ? (
              <List disablePadding>
                {dashboardData.activeCourses.map((course) => (
                  <React.Fragment key={course.courseId}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <MenuBookIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={course.title}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={course.progress} 
                              sx={{ flexGrow: 1, mr: 1 }} 
                            />
                            <Typography variant="caption">
                              {course.progress}%
                            </Typography>
                          </Box>
                        }
                      />
                      <Button 
                        startIcon={<PlayArrowIcon />}
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/courses/${course.courseId}`)}
                      >
                        {t('dashboard.continue')}
                      </Button>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                {t('dashboard.noCourses')}
              </Typography>
            )}
          </Paper>
          
          {/* Weekly Activity */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {t('dashboard.weeklyActivity')}
            </Typography>
            <Box height={300}>
              <Line 
                data={weeklyActivityData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: t('dashboard.minutesSpent')
                      }
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
          
          {/* Quiz Performance */}
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                {t('dashboard.recentQuizzes')}
              </Typography>
              <Button size="small" onClick={() => navigate('/quizzes')} color="primary">
                {t('dashboard.viewAll')}
              </Button>
            </Box>
            
            {dashboardData?.recentQuizAttempts?.length > 0 ? (
              <Box height={250}>
                <Bar 
                  data={quizPerformanceData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: t('dashboard.score')
                        }
                      }
                    }
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                {t('dashboard.noQuizzes')}
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Right Column - Notifications, Progress Chart, Recommendations */}
        <Grid item xs={12} md={4}>
          {/* Notifications */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                {t('dashboard.latestNotifications')}
              </Typography>
              <Button size="small" onClick={() => navigate('/notifications')} color="primary">
                {t('dashboard.viewAll')}
              </Button>
            </Box>
            
            {notifications.length > 0 ? (
              <List disablePadding>
                {notifications.slice(0, 5).map((notification) => (
                  <React.Fragment key={notification.id}>
                    <ListItem 
                      sx={{ px: 0, bgcolor: notification.isRead ? 'transparent' : 'action.hover' }}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            {!notification.isRead && (
                              <Box 
                                component="span"
                                sx={{
                                  display: 'inline-block',
                                  width: 8,
                                  height: 8,
                                  bgcolor: 'primary.main',
                                  borderRadius: '50%',
                                  mr: 1
                                }}
                              />
                            )}
                            {notification.title}
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" component="span">
                            {notification.message}
                            {notification.courseName && (
                              <Chip 
                                label={notification.courseName} 
                                size="small" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                          </Typography>
                        }
                      />
                      {!notification.isRead && (
                        <Button 
                          size="small"
                          onClick={() => handleNotificationRead(notification.id)}
                        >
                          {t('dashboard.markRead')}
                        </Button>
                      )}
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                {t('dashboard.noNotifications')}
              </Typography>
            )}
          </Paper>
          
          {/* Progress Distribution */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {t('dashboard.courseProgress')}
            </Typography>
            
            {dashboardData?.activeCourses?.length > 0 ? (
              <Box height={220} display="flex" justifyContent="center">
                <Doughnut 
                  data={progressData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                {t('dashboard.noCourseData')}
              </Typography>
            )}
          </Paper>
          
          {/* Peer Collaboration */}
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                {t('dashboard.collaboration')}
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/collaboration')} 
                color="primary"
              >
                {t('dashboard.viewAll')}
              </Button>
            </Box>
            
            <Box display="flex" flexDirection="column" alignItems="center" py={2}>
              <GroupIcon sx={{ fontSize: 50, color: theme.palette.secondary.main, mb: 1 }} />
              <Typography variant="body1" align="center" gutterBottom>
                {t('dashboard.findStudyBuddies')}
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                sx={{ mt: 1 }}
                onClick={() => navigate('/collaboration/new')}
              >
                {t('dashboard.findCollaborators')}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </StudentLayout>
  );
};

export default StudentDashboard;
