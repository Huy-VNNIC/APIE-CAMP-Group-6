import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import AssignmentCard from '../components/AssignmentCard';

// Icons
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Placeholder data for recent courses
const recentCourses = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    progress: 45,
    lastAccessed: '2023-05-22T14:30:00',
    image: 'https://placehold.co/600x400/2196f3/fff?text=JS'
  },
  {
    id: '2',
    title: 'Python for Beginners',
    progress: 20,
    lastAccessed: '2023-05-25T09:15:00',
    image: 'https://placehold.co/600x400/4caf50/fff?text=Python'
  },
  {
    id: '3',
    title: 'Advanced React',
    progress: 15,
    lastAccessed: '2023-05-27T11:45:00',
    image: 'https://placehold.co/600x400/ff5722/fff?text=React'
  },
  {
    id: '4',
    title: 'Node.js & Express',
    progress: 10,
    lastAccessed: '2023-05-28T16:20:00',
    image: 'https://placehold.co/600x400/9c27b0/fff?text=Node.js'
  }
];

// Recent assignments data
const recentAssignments = [
  {
    id: '1',
    title: 'JavaScript - Arrays and Objects Exercise',
    description: 'Practice using array methods and working with objects in JavaScript',
    language: 'JavaScript',
    dueDate: '01/06/2023',
    progress: 35,
    course: 'JavaScript Fundamentals'
  },
  {
    id: '2',
    title: 'Python - Final Project',
    description: 'Build a simple Library Management System with Python',
    language: 'Python',
    dueDate: '15/06/2023', 
    progress: 10,
    course: 'Python for Beginners'
  },
  {
    id: '3',
    title: 'React - Custom Hooks Library',
    description: 'Create a collection of useful custom hooks that solve real-world problems',
    language: 'React',
    dueDate: '10/07/2023',
    progress: 0,
    course: 'Advanced React'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { t } = useTranslation();
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle view all assignments
  const handleViewAllAssignments = () => {
    navigate('/assignments');
  };
  
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Welcome message */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Avatar
              sx={{ 
                width: 64, 
                height: 64, 
                mr: 2,
                bgcolor: 'white',
                color: 'primary.main'
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || <PersonIcon />}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {t('dashboard.welcome_back')}, {user?.fullName || user?.username || t('common.user')}!
              </Typography>
              <Typography variant="body1">
                {t('dashboard.welcome_message')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Main content area */}
        <Grid item xs={12} md={8}>
          {/* Recent courses section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                {t('dashboard.your_courses')}
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/courses')}
              >
                {t('common.view_all')}
              </Button>
            </Box>
            
            {recentCourses.length > 0 ? (
              <Grid container spacing={2}>
                {recentCourses.map((course) => (
                  <Grid item xs={12} sm={6} key={course.id}>
                    <Card>
                      <Box sx={{ position: 'relative' }}>
                        <img 
                          src={course.image} 
                          alt={course.title}
                          style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            right: 0, 
                            height: '4px', 
                            bgcolor: 'grey.300'
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: `${course.progress}%`, 
                              height: '100%', 
                              bgcolor: 'success.main'
                            }}
                          />
                        </Box>
                      </Box>
                      <CardContent>
                        <Typography variant="h6" noWrap gutterBottom>
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {course.progress}% {t('dashboard.completed')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('dashboard.last_accessed')}: {formatDate(course.lastAccessed)}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          startIcon={<PlayArrowIcon />}
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          {t('dashboard.continue_learning')}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  {t('dashboard.no_courses')}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/courses')}
                >
                  {t('dashboard.explore_courses')}
                </Button>
              </Card>
            )}
          </Box>
          
          {/* Recent assignments section */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                {t('dashboard.recent_exercises')}
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleViewAllAssignments}
              >
                {t('common.view_all')}
              </Button>
            </Box>
            
            {recentAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </Box>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Quick actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.quick_tools')}
              </Typography>
            </CardContent>
            <Divider />
            <List>
              <ListItem button onClick={() => navigate('/playground')}>
                <ListItemIcon>
                  <CodeIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={t('nav.playground')} />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => navigate('/courses')}>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={t('nav.courses')} />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => navigate('/assignments')}>
                <ListItemIcon>
                  <AssignmentIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={t('nav.assignments')} />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => navigate('/profile')}>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={t('common.profile')} />
              </ListItem>
            </List>
          </Card>
          
          {/* Progress stats */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.progress')}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{t('dashboard.stats.completed_courses')}</Typography>
                  <Typography variant="body2" fontWeight="bold">1/4</Typography>
                </Box>
                <Box sx={{ width: '100%', height: '8px', bgcolor: 'grey.300', borderRadius: 1, mt: 1 }}>
                  <Box sx={{ width: '25%', height: '100%', bgcolor: 'primary.main', borderRadius: 1 }} />
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{t('dashboard.stats.submitted_exercises')}</Typography>
                  <Typography variant="body2" fontWeight="bold">12/15</Typography>
                </Box>
                <Box sx={{ width: '100%', height: '8px', bgcolor: 'grey.300', borderRadius: 1, mt: 1 }}>
                  <Box sx={{ width: '80%', height: '100%', bgcolor: 'success.main', borderRadius: 1 }} />
                </Box>
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{t('dashboard.stats.average_score')}</Typography>
                  <Typography variant="body2" fontWeight="bold">8.5/10</Typography>
                </Box>
                <Box sx={{ width: '100%', height: '8px', bgcolor: 'grey.300', borderRadius: 1, mt: 1 }}>
                  <Box sx={{ width: '85%', height: '100%', bgcolor: 'warning.main', borderRadius: 1 }} />
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/profile')}>
                {t('common.view_details')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
