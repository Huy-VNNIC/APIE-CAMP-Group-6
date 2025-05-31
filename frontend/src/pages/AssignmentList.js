import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AssignmentCard from '../components/AssignmentCard';

// Icons
import SearchIcon from '@mui/icons-material/Search';

// Mock data for assignments
const mockAssignments = [
  {
    id: '1',
    title: 'JavaScript - Arrays and Objects Exercise',
    description: 'Practice using array methods and working with objects in JavaScript',
    language: 'JavaScript',
    dueDate: '01/06/2023',
    progress: 35,
    status: 'open',
    course: 'JavaScript Fundamentals'
  },
  {
    id: '2',
    title: 'Python - Final Project',
    description: 'Build a simple Library Management System with Python',
    language: 'Python',
    dueDate: '15/06/2023',
    progress: 10,
    status: 'open',
    course: 'Python for Beginners'
  },
  {
    id: '3',
    title: 'HTML & CSS - Personal Portfolio',
    description: 'Design and build a responsive personal portfolio website',
    language: 'HTML/CSS',
    dueDate: '10/06/2023',
    progress: 0,
    status: 'open',
    course: 'Web Development'
  },
  {
    id: '4',
    title: 'React - Shopping Cart',
    description: 'Build a shopping cart component with React and manage state',
    language: 'React.js',
    dueDate: '20/06/2023',
    progress: 0,
    status: 'open',
    course: 'Advanced React'
  },
  {
    id: '5',
    title: 'MongoDB - Database Schema',
    description: 'Design a schema for a blog application with MongoDB',
    language: 'MongoDB',
    dueDate: '28/05/2023',
    progress: 100,
    status: 'completed',
    course: 'MongoDB Basics'
  },
  {
    id: '6',
    title: 'React - Custom Hooks Library',
    description: 'Create a collection of useful custom hooks that solve real-world problems',
    language: 'React',
    dueDate: '10/07/2023',
    progress: 0,
    status: 'open',
    course: 'Advanced React'
  },
  {
    id: '7',
    title: 'Express - RESTful API',
    description: 'Build a complete RESTful API with Express.js with authentication and error handling',
    language: 'Node.js',
    dueDate: '15/07/2023',
    progress: 5,
    status: 'open',
    course: 'Node.js & Express'
  }
];

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`assignment-tabpanel-${index}`}
      aria-labelledby={`assignment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AssignmentList = () => {
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [sortBy, setSortBy] = useState('dueDate');

  // Initialize assignments
  useEffect(() => {
    // Simulate API call with timeout
    const fetchAssignments = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setAssignments(mockAssignments);
          setFilteredAssignments(mockAssignments);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Handle filters and search
  useEffect(() => {
    let result = [...assignments];
    
    // Filter by tab
    if (tabValue === 1) {
      // Overdue - due date is in the past
      result = result.filter(assignment => {
        const dueDate = assignment.dueDate.includes('/') 
          ? new Date(assignment.dueDate.split('/').reverse().join('-')) 
          : new Date(assignment.dueDate);
        return dueDate < new Date() && assignment.progress < 100;
      });
    } else if (tabValue === 2) {
      // Completed
      result = result.filter(assignment => assignment.progress === 100);
    } else {
      // All (active & upcoming)
      result = result.filter(assignment => {
        const dueDate = assignment.dueDate.includes('/') 
          ? new Date(assignment.dueDate.split('/').reverse().join('-')) 
          : new Date(assignment.dueDate);
        return dueDate >= new Date() || assignment.progress < 100;
      });
    }
    
    // Filter by language
    if (languageFilter !== 'all') {
      result = result.filter(
        assignment => assignment.language.toLowerCase() === languageFilter.toLowerCase()
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        assignment => 
          assignment.title.toLowerCase().includes(search) || 
          assignment.description.toLowerCase().includes(search) ||
          assignment.course.toLowerCase().includes(search)
      );
    }
    
    // Sort assignments
    result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        const dateA = a.dueDate.includes('/') 
          ? new Date(a.dueDate.split('/').reverse().join('-')) 
          : new Date(a.dueDate);
        const dateB = b.dueDate.includes('/') 
          ? new Date(b.dueDate.split('/').reverse().join('-')) 
          : new Date(b.dueDate);
        return dateA - dateB;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'progress') {
        return b.progress - a.progress;
      }
      return 0;
    });
    
    setFilteredAssignments(result);
  }, [assignments, searchTerm, languageFilter, tabValue, sortBy]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get unique languages for filter
  const languages = ['all', ...new Set(assignments.map(a => a.language.toLowerCase()))];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('assignments.title')}
      </Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              label={t('assignments.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('assignments.filter.language')}</InputLabel>
              <Select
                value={languageFilter}
                label={t('assignments.filter.language')}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                <MenuItem value="all">{t('assignments.filter.all')}</MenuItem>
                {languages.filter(lang => lang !== 'all').map(language => (
                  <MenuItem key={language} value={language}>
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('assignments.sort_by')}</InputLabel>
              <Select
                value={sortBy}
                label={t('assignments.sort_by')}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="dueDate">{t('assignments.due_date')}</MenuItem>
                <MenuItem value="title">{t('assignments.title')}</MenuItem>
                <MenuItem value="progress">{t('assignments.progress')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="assignment tabs">
          <Tab label={t('assignments.all')} />
          <Tab label={t('assignments.overdue')} />
          <Tab label={t('assignments.completed')} />
        </Tabs>
      </Box>
      
      {/* Assignment lists by tab */}
      <TabPanel value={tabValue} index={0}>
        {filteredAssignments.length > 0 ? (
          <Grid container spacing={2}>
            {filteredAssignments.map((assignment) => (
              <Grid item xs={12} md={6} key={assignment.id}>
                <AssignmentCard assignment={assignment} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {t('assignments.no_assignments')}
            </Typography>
          </Box>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {filteredAssignments.length > 0 ? (
          <Grid container spacing={2}>
            {filteredAssignments.map((assignment) => (
              <Grid item xs={12} md={6} key={assignment.id}>
                <AssignmentCard assignment={assignment} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {t('assignments.no_overdue')}
            </Typography>
          </Box>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {filteredAssignments.length > 0 ? (
          <Grid container spacing={2}>
            {filteredAssignments.map((assignment) => (
              <Grid item xs={12} md={6} key={assignment.id}>
                <AssignmentCard assignment={assignment} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {t('assignments.no_completed')}
            </Typography>
          </Box>
        )}
      </TabPanel>
    </Box>
  );
};

export default AssignmentList;
