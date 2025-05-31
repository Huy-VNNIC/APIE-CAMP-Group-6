import React, { useState, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Chip,
  IconButton,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import QuizIcon from '@mui/icons-material/Quiz';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Sample data for students
const studentData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    enrolledCourses: ['JavaScript Fundamentals', 'Advanced React'],
    progress: 78,
    lastActive: '2023-05-28',
    completedAssignments: 12,
    totalAssignments: 15
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    enrolledCourses: ['Python for Beginners', 'MongoDB Basics'],
    progress: 65,
    lastActive: '2023-05-29',
    completedAssignments: 8,
    totalAssignments: 15
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    enrolledCourses: ['Node.js & Express', 'AWS for Developers'],
    progress: 42,
    lastActive: '2023-05-30',
    completedAssignments: 5,
    totalAssignments: 12
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    enrolledCourses: ['JavaScript Fundamentals', 'MongoDB Basics'],
    progress: 90,
    lastActive: '2023-05-31',
    completedAssignments: 14,
    totalAssignments: 15
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    enrolledCourses: ['Advanced React', 'AWS for Developers'],
    progress: 55,
    lastActive: '2023-05-27',
    completedAssignments: 6,
    totalAssignments: 12
  }
];

// Sample data for quizzes
const quizData = [
  {
    id: 1,
    title: 'JavaScript Basics Quiz',
    course: 'JavaScript Fundamentals',
    questions: 10,
    timesCompleted: 42,
    averageScore: 78,
    createdAt: '2023-05-15'
  },
  {
    id: 2,
    title: 'Python Data Structures',
    course: 'Python for Beginners',
    questions: 15,
    timesCompleted: 28,
    averageScore: 72,
    createdAt: '2023-05-20'
  },
  {
    id: 3,
    title: 'React Hooks Deep Dive',
    course: 'Advanced React',
    questions: 12,
    timesCompleted: 19,
    averageScore: 65,
    createdAt: '2023-05-25'
  },
  {
    id: 4,
    title: 'Express Middleware',
    course: 'Node.js & Express',
    questions: 8,
    timesCompleted: 15,
    averageScore: 70,
    createdAt: '2023-05-28'
  }
];

// Sample data for course progress
const courseProgressData = [
  { course: 'JavaScript Fundamentals', studentsEnrolled: 120, averageCompletion: 72, averageQuizScore: 78 },
  { course: 'Python for Beginners', studentsEnrolled: 95, averageCompletion: 68, averageQuizScore: 74 },
  { course: 'Advanced React', studentsEnrolled: 75, averageCompletion: 58, averageQuizScore: 69 },
  { course: 'Node.js & Express', studentsEnrolled: 85, averageCompletion: 62, averageQuizScore: 71 },
  { course: 'MongoDB Basics', studentsEnrolled: 65, averageCompletion: 70, averageQuizScore: 76 },
  { course: 'AWS for Developers', studentsEnrolled: 55, averageCompletion: 48, averageQuizScore: 68 }
];

// Tab Panel component
function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const InstructorDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [courseFilter, setCourseFilter] = useState('all');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Create a new quiz
  const handleCreateQuiz = () => {
    navigate('/create-quiz');
  };
  
  // View student details
  const handleViewStudent = (studentId) => {
    navigate(`/student/${studentId}`);
  };
  
  // Filter students by course
  const filteredStudents = courseFilter === 'all' 
    ? studentData 
    : studentData.filter(student => 
        student.enrolledCourses.includes(courseFilter)
      );
  
  // Get unique courses from student data
  const uniqueCourses = [...new Set(
    studentData.flatMap(student => student.enrolledCourses)
  )];
  
  return (
    <Box>
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 3, 
        borderRadius: 2, 
        mb: 3,
        display: 'flex',
        alignItems: 'center'
      }}>
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
          <Typography variant="h4" component="h1" gutterBottom>
            Instructor Dashboard
          </Typography>
          <Typography variant="body1">
            Manage your courses, students, and create quizzes
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="instructor tabs">
          <Tab label="Overview" icon={<BarChartIcon />} iconPosition="start" />
          <Tab label="Students" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Quizzes" icon={<QuizIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Course Progress Overview
            </Typography>
          </Grid>
          
          {/* Course performance cards */}
          {courseProgressData.map((course, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" noWrap gutterBottom>
                    {course.course}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Students Enrolled
                      </Typography>
                      <Typography variant="h6">
                        {course.studentsEnrolled}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Avg Completion
                      </Typography>
                      <Typography variant="h6">
                        {course.averageCompletion}%
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Average Quiz Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={course.averageQuizScore} 
                            sx={{ height: 10, borderRadius: 5 }}
                            color={course.averageQuizScore >= 70 ? "success" : course.averageQuizScore >= 50 ? "warning" : "error"}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {course.averageQuizScore}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              Recent Activity
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Activity</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Score/Progress</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Emily Davis</TableCell>
                    <TableCell>Completed Quiz: JavaScript Basics</TableCell>
                    <TableCell>May 31, 2023</TableCell>
                    <TableCell>92%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Robert Johnson</TableCell>
                    <TableCell>Submitted Assignment: AWS Lambda Functions</TableCell>
                    <TableCell>May 30, 2023</TableCell>
                    <TableCell>78%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>Started Course: MongoDB Basics</TableCell>
                    <TableCell>May 29, 2023</TableCell>
                    <TableCell>15% complete</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Michael Brown</TableCell>
                    <TableCell>Completed Assignment: React Hooks</TableCell>
                    <TableCell>May 27, 2023</TableCell>
                    <TableCell>85%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Students Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Student Management
          </Typography>
          
          <FormControl sx={{ width: 240 }}>
            <InputLabel id="course-filter-label">Filter by Course</InputLabel>
            <Select
              labelId="course-filter-label"
              value={courseFilter}
              label="Filter by Course"
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <MenuItem value="all">All Courses</MenuItem>
              {uniqueCourses.map((course, index) => (
                <MenuItem key={index} value={course}>{course}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Courses</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Last Active</TableCell>
                <TableCell>Assignments</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.enrolledCourses.map((course, idx) => (
                      <Chip key={idx} label={course} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 100, mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={student.progress} 
                          sx={{ height: 6, borderRadius: 3 }}
                          color={student.progress >= 70 ? "success" : student.progress >= 40 ? "warning" : "error"}
                        />
                      </Box>
                      <Typography variant="body2">{student.progress}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{student.lastActive}</TableCell>
                  <TableCell>{student.completedAssignments}/{student.totalAssignments}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleViewStudent(student.id)}
                      sx={{ mr: 1 }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="secondary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      
      {/* Quizzes Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Quiz Management
          </Typography>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleCreateQuiz}
          >
            Create New Quiz
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Questions</TableCell>
                <TableCell>Times Completed</TableCell>
                <TableCell>Avg. Score</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizData.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{quiz.course}</TableCell>
                  <TableCell>{quiz.questions}</TableCell>
                  <TableCell>{quiz.timesCompleted}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 100, mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={quiz.averageScore} 
                          sx={{ height: 6, borderRadius: 3 }}
                          color={quiz.averageScore >= 70 ? "success" : quiz.averageScore >= 50 ? "warning" : "error"}
                        />
                      </Box>
                      <Typography variant="body2">{quiz.averageScore}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{quiz.createdAt}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="secondary"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
};

export default InstructorDashboard;
