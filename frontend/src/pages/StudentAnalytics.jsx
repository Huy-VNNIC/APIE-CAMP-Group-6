import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import StudentLayout from '../components/StudentLayout';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

// Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SchoolIcon from '@mui/icons-material/School';

// Services
import { getStudentAnalytics } from '../services/studentService';

// Charts
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
  RadialLinearScale,
  ArcElement
} from 'chart.js';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';

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
  RadialLinearScale,
  ArcElement
);

const StudentAnalytics = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [courseId, setCourseId] = useState('');
  const [tab, setTab] = useState(0);
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await getStudentAnalytics(courseId || null);
        setAnalytics(response.data);
        
        // In a real app, you would get the course list from a separate API
        // For now, let's create a mock list
        if (!courses.length) {
          setCourses([
            { id: '', name: 'All Courses' },
            { id: 'course1', name: 'Introduction to Programming' },
            { id: 'course2', name: 'Web Development Fundamentals' },
            { id: 'course3', name: 'Data Structures and Algorithms' }
          ]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [courseId]);
  
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
  
  const handleCourseChange = (event) => {
    setCourseId(event.target.value);
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
  
  // Sample data for the charts - in a real app, this would come from analytics
  const dailyActivityData = {
    labels: analytics?.dailyActivity?.map(d => d.date) || [],
    datasets: [
      {
        label: t('analytics.timeSpent'),
        data: analytics?.dailyActivity?.map(d => d.minutesActive) || [45, 60, 30, 75, 40, 20, 35],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
        fill: false,
        tension: 0.3
      }
    ]
  };
  
  const quizPerformanceData = {
    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
    datasets: [
      {
        label: t('analytics.score'),
        data: [85, 70, 90, 65, 78],
        backgroundColor: theme.palette.info.light,
      }
    ]
  };
  
  const courseProgressData = {
    labels: ['Course 1', 'Course 2', 'Course 3'],
    datasets: [
      {
        data: [75, 25, 50],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main
        ],
      }
    ]
  };
  
  const skillsRadarData = {
    labels: [
      'Problem Solving',
      'Critical Thinking', 
      'Data Analysis',
      'Coding',
      'Teamwork',
      'Communication'
    ],
    datasets: [
      {
        label: t('analytics.currentSkills'),
        data: [4, 3, 5, 4, 3, 4],
        backgroundColor: theme.palette.primary.light + '80',
        borderColor: theme.palette.primary.main,
        pointBackgroundColor: theme.palette.primary.main,
      }
    ]
  };
  
  return (
    <StudentLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('analytics.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {t('analytics.description')}
          </Typography>
        
        <Box mt={3} mb={4}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="course-select-label">{t('analytics.selectCourse')}</InputLabel>
            <Select
              labelId="course-select-label"
              id="course-select"
              value={courseId}
              label={t('analytics.selectCourse')}
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
      </Box>
      
      {/* Analytics Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', py: 3 }}>
              <Box sx={{ mr: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('analytics.totalTimeSpent')}
                </Typography>
                <Typography variant="h5">
                  {analytics?.totalTimeSpent?.formatted || '0h 0m'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', py: 3 }}>
              <Box sx={{ mr: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('analytics.overallProgress')}
                </Typography>
                <Typography variant="h5">
                  {analytics?.overallProgress || 0}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', py: 3 }}>
              <Box sx={{ mr: 2 }}>
                <AssessmentIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('analytics.quizPerformance')}
                </Typography>
                <Typography variant="h5">
                  {analytics?.quizPerformance || 0}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', py: 3 }}>
              <Box sx={{ mr: 2 }}>
                <SchoolIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('analytics.coursesCompleted')}
                </Typography>
                <Typography variant="h5">
                  {analytics?.coursesCompleted || 0}/{analytics?.coursesEnrolled || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tab} 
            onChange={handleTabChange} 
            aria-label="analytics tabs"
            variant="fullWidth"
          >
            <Tab label={t('analytics.tabs.activity')} />
            <Tab label={t('analytics.tabs.progress')} />
            <Tab label={t('analytics.tabs.skills')} />
            <Tab label={t('analytics.tabs.recommendations')} />
          </Tabs>
        </Box>
        
        {/* Activity Tab */}
        {tab === 0 && (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              {t('analytics.dailyActivity')}
            </Typography>
            <Box height={350}>
              <Line 
                data={dailyActivityData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: t('analytics.minutes')
                      }
                    }
                  }
                }} 
              />
            </Box>
          </Box>
        )}
        
        {/* Progress Tab */}
        {tab === 1 && (
          <Box p={3}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  {t('analytics.courseProgress')}
                </Typography>
                <Box height={250} display="flex" justifyContent="center">
                  <Doughnut 
                    data={courseProgressData}
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
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  {t('analytics.quizPerformance')}
                </Typography>
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
                            text: t('analytics.score')
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Skills Tab */}
        {tab === 2 && (
          <Box p={3}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom>
                  {t('analytics.skillsAssessment')}
                </Typography>
                <Box height={400}>
                  <Radar 
                    data={skillsRadarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 5,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader title={t('analytics.strengthsWeaknesses')} />
                  <Divider />
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {t('analytics.strengths')}:
                    </Typography>
                    <List dense>
                      {analytics?.strengths?.length > 0 ? 
                        analytics.strengths.map((strength, index) => (
                          <ListItem key={`strength-${index}`}>
                            <ListItemText primary={strength} />
                          </ListItem>
                        )) : (
                          <>
                            <ListItem>
                              <ListItemText primary="Data Analysis" />
                            </ListItem>
                            <ListItem>
                              <ListItemText primary="Problem Solving" />
                            </ListItem>
                          </>
                        )
                      }
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      {t('analytics.improvementAreas')}:
                    </Typography>
                    <List dense>
                      {analytics?.improvementAreas?.length > 0 ? 
                        analytics.improvementAreas.map((area, index) => (
                          <ListItem key={`area-${index}`}>
                            <ListItemText primary={area} />
                          </ListItem>
                        )) : (
                          <>
                            <ListItem>
                              <ListItemText primary="Teamwork" />
                            </ListItem>
                            <ListItem>
                              <ListItemText primary="Communication" />
                            </ListItem>
                          </>
                        )
                      }
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Recommendations Tab */}
        {tab === 3 && (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              {t('analytics.recommendations')}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader 
                    title={t('analytics.coursesRecommended')}
                    avatar={<EmojiObjectsIcon color="primary" />}
                  />
                  <Divider />
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Advanced Data Structures"
                          secondary="Based on your strong performance in data analysis and algorithm courses"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Team Project Workshop"
                          secondary="To improve your teamwork and communication skills"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardHeader 
                    title={t('analytics.focusAreas')}
                    avatar={<TrendingUpIcon color="secondary" />}
                  />
                  <Divider />
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Spend more time practicing collaborative coding exercises"
                          secondary="This will help improve your teamwork and communication skills"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Review the algorithms section in your Data Structures course"
                          secondary="Your quiz scores indicate room for improvement in this area"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default StudentAnalytics;
