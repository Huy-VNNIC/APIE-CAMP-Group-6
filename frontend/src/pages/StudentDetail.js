import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Tabs,
  Tab,
  List,
  CircularProgress,
  LinearProgress
} from '@mui/material';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import TimerIcon from '@mui/icons-material/Timer';
import DownloadIcon from '@mui/icons-material/Download';

// Sample student data
const SAMPLE_STUDENT = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '',
  enrollDate: '2023-01-15',
  lastActive: '2023-05-28',
  overallProgress: 78,
  courses: [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      progress: 92,
      enrollDate: '2023-01-15',
      lastAccessed: '2023-05-28',
      completed: true
    },
    {
      id: '3',
      title: 'Advanced React',
      progress: 45,
      enrollDate: '2023-03-10',
      lastAccessed: '2023-05-27',
      completed: false
    }
  ],
  assignments: [
    {
      id: '1',
      title: 'JavaScript Arrays and Objects',
      course: 'JavaScript Fundamentals',
      dueDate: '2023-02-20',
      submittedDate: '2023-02-18',
      grade: 95,
      status: 'completed'
    },
    {
      id: '2',
      title: 'React Custom Hooks Library',
      course: 'Advanced React',
      dueDate: '2023-05-30',
      submittedDate: null,
      grade: null,
      status: 'pending'
    }
  ],
  quizzes: [
    {
      id: '1',
      title: 'JavaScript Basics Quiz',
      course: 'JavaScript Fundamentals',
      completedDate: '2023-02-05',
      score: 85,
      timeSpent: '18 minutes',
      totalQuestions: 10,
      correctAnswers: 8
    },
    {
      id: '3',
      title: 'React Hooks Quiz',
      course: 'Advanced React',
      completedDate: '2023-04-15',
      score: 75,
      timeSpent: '24 minutes',
      totalQuestions: 12,
      correctAnswers: 9
    },
    {
      id: '4',
      title: 'Advanced React Patterns',
      course: 'Advanced React',
      completedDate: null,
      score: null,
      status: 'not_started'
    }
  ],
  notes: [
    {
      id: 1,
      date: '2023-05-10',
      content: 'John is making excellent progress in JavaScript fundamentals, but needs additional support with advanced React concepts.'
    },
    {
      id: 2,
      date: '2023-04-02',
      content: 'Had a 1:1 session to go over React hooks. Student showing good understanding but needs more practice.'
    }
  ]
};

// TabPanel component
function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`student-tabpanel-${index}`}>
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    // In a real app, we would fetch data from API
    // For now, use the sample data
    setTimeout(() => {
      setStudent(SAMPLE_STUDENT);
      setLoading(false);
    }, 1000);
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!student) {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Student not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/instructor')}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }
  
  const getStatusChip = (status) => {
    switch(status) {
      case 'completed':
        return <Chip 
          label="Completed" 
          color="success" 
          size="small" 
          icon={<CheckCircleIcon />} 
        />;
      case 'pending':
        return <Chip 
          label="Pending" 
          color="warning" 
          size="small" 
          icon={<TimerIcon />} 
        />;
      case 'overdue':
        return <Chip 
          label="Overdue" 
          color="error" 
          size="small" 
          icon={<CancelIcon />} 
        />;
      case 'not_started':
        return <Chip 
          label="Not Started" 
          color="default" 
          size="small" 
        />;
      default:
        return null;
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/instructor')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Student Details
        </Typography>
      </Box>
      
      {/* Student Profile Card */}
      <Paper sx={{ p: 3, mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mr: { md: 4 },
          mb: { xs: 3, md: 0 },
          minWidth: { md: '200px' }
        }}>
          <Avatar
            sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem' }}
          >
            {student.name.charAt(0)}
          </Avatar>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" component="h2">
              {student.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {student.email}
            </Typography>
            <Chip 
              label={`${student.overallProgress}% Overall Progress`} 
              color={
                student.overallProgress >= 75 ? 'success' : 
                student.overallProgress >= 50 ? 'warning' : 
                'error'
              }
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
        
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
        <Divider sx={{ display: { xs: 'block', md: 'none' }, my: 2 }} />
        
        <Box sx={{ flexGrow: 1, px: { md: 3 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Enrolled Since
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(student.enrollDate).toLocaleDateString()}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Last Active
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(student.lastActive).toLocaleDateString()}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Enrolled Courses
              </Typography>
              <Typography variant="body1" gutterBottom>
                {student.courses.length}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Completed Courses
              </Typography>
              <Typography variant="body1" gutterBottom>
                {student.courses.filter(course => course.completed).length}/{student.courses.length}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DescriptionIcon />}
                >
                  Generate Report
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                >
                  Export Data
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Tabs for different sections */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="student details tabs">
          <Tab icon={<SchoolIcon />} iconPosition="start" label="Courses" />
          <Tab icon={<AssignmentIcon />} iconPosition="start" label="Assignments" />
          <Tab icon={<QuizIcon />} iconPosition="start" label="Quizzes" />
          <Tab icon={<DescriptionIcon />} iconPosition="start" label="Notes" />
        </Tabs>
      </Box>
      
      {/* Courses Tab */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Enrolled Courses
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Enrollment Date</TableCell>
                <TableCell>Last Accessed</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {student.courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    {new Date(course.enrollDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(course.lastAccessed).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={course.progress} 
                          sx={{ height: 8, borderRadius: 4 }}
                          color={
                            course.progress >= 75 ? 'success' : 
                            course.progress >= 50 ? 'warning' : 
                            'error'
                          }
                        />
                      </Box>
                      <Typography variant="body2">
                        {course.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={course.completed ? "Completed" : "In Progress"} 
                      color={course.completed ? "success" : "primary"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      
      {/* Assignments Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Assignments
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Assignment</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {student.assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{assignment.course}</TableCell>
                  <TableCell>
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {assignment.submittedDate 
                      ? new Date(assignment.submittedDate).toLocaleDateString() 
                      : "Not submitted"}
                  </TableCell>
                  <TableCell>
                    {assignment.grade !== null ? `${assignment.grade}%` : "—"}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(assignment.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      
      {/* Quizzes Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Quiz Results
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Quiz</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Completed Date</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Correct Answers</TableCell>
                <TableCell>Time Spent</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {student.quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{quiz.course}</TableCell>
                  <TableCell>
                    {quiz.completedDate 
                      ? new Date(quiz.completedDate).toLocaleDateString() 
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {quiz.score !== null ? `${quiz.score}%` : "—"}
                  </TableCell>
                  <TableCell>
                    {quiz.correctAnswers !== null 
                      ? `${quiz.correctAnswers}/${quiz.totalQuestions}` 
                      : "—"}
                  </TableCell>
                  <TableCell>{quiz.timeSpent || "—"}</TableCell>
                  <TableCell>
                    {quiz.completedDate 
                      ? <Chip 
                          label="Completed" 
                          color={quiz.score >= 70 ? "success" : "warning"} 
                          size="small" 
                        />
                      : getStatusChip(quiz.status || 'not_started')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      
      {/* Notes Tab */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Instructor Notes
          </Typography>
          
          <Button
            variant="contained"
            size="small"
          >
            Add Note
          </Button>
        </Box>
        
        <List>
          {student.notes.map((note) => (
            <Paper key={note.id} sx={{ mb: 2, p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {new Date(note.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                {note.content}
              </Typography>
            </Paper>
          ))}
          
          {student.notes.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No notes have been added for this student yet.
            </Typography>
          )}
        </List>
      </TabPanel>
    </Box>
  );
};

export default StudentDetail;
