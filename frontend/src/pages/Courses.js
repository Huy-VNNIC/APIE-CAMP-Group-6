import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  // Button, // Removed unused import
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';

// Mock course data (this would normally come from an API)
const mockCourses = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming language, including syntax, variables, functions, and basic control structures in JavaScript.',
    category: 'frontend',
    level: 'beginner',
    instructor: 'John Smith',
    image: 'https://placehold.co/600x400/2196f3/fff?text=JavaScript+Basics',
    duration: '12 hours',
    rating: 4.5,
    enrollments: 1250
  },
  {
    id: '2',
    title: 'Python for Beginners',
    description: 'Learn Python from basics to advanced with practical examples, suitable for people with no programming experience.',
    category: 'backend',
    level: 'beginner',
    instructor: 'Emily Parker',
    image: 'https://placehold.co/600x400/4caf50/fff?text=Python+For+Beginners',
    duration: '15 hours',
    rating: 4.8,
    enrollments: 980
  },
  {
    id: '3',
    title: 'Advanced React',
    description: 'Deep dive into React.js and learn how to build professional, scalable applications with advanced patterns and best practices.',
    category: 'frontend',
    level: 'advanced',
    instructor: 'Leo Chen',
    image: 'https://placehold.co/600x400/ff5722/fff?text=Advanced+React',
    duration: '18 hours',
    rating: 4.7,
    enrollments: 735
  },
  {
    id: '4',
    title: 'Node.js & Express',
    description: 'Learn how to build scalable and robust RESTful APIs using Node.js and Express framework with industry best practices.',
    category: 'backend',
    level: 'intermediate',
    instructor: 'Priya Sharma',
    image: 'https://placehold.co/600x400/9c27b0/fff?text=Node.js+Express',
    duration: '16 hours',
    rating: 4.6,
    enrollments: 850
  },
  {
    id: '5',
    title: 'MongoDB Basics',
    description: 'Learn the fundamentals of NoSQL databases through MongoDB, including data modeling, CRUD operations, and integration with applications.',
    category: 'database',
    level: 'beginner',
    instructor: 'Howard Zhang',
    image: 'https://placehold.co/600x400/795548/fff?text=MongoDB+Basics',
    duration: '12 hours',
    rating: 4.3,
    enrollments: 620
  },
  {
    id: '6',
    title: 'AWS for Developers',
    description: 'Learn how to deploy, scale, and manage applications on AWS cloud platform using industry best practices and architecture patterns.',
    category: 'devops',
    level: 'intermediate',
    instructor: 'Fiona Reynolds',
    image: 'https://placehold.co/600x400/607d8b/fff?text=AWS+for+Developers',
    duration: '20 hours',
    rating: 4.9,
    enrollments: 475
  }
];

const Courses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Simulate API call with timeout
    setTimeout(() => {
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setLoading(false);
    }, 500);
  }, []);
  
  useEffect(() => {
    let result = [...courses];
    
    // Filter by category
    if (category !== 'all') {
      result = result.filter(course => course.category === category);
    }
    
    // Filter by level
    if (level !== 'all') {
      result = result.filter(course => course.level === level);
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        course => 
          course.title.toLowerCase().includes(search) || 
          course.description.toLowerCase().includes(search) ||
          course.instructor.toLowerCase().includes(search)
      );
    }
    
    setFilteredCourses(result);
  }, [courses, category, level, searchTerm]);
  
  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };
  
  // Get level display info
  const getLevelDisplay = (courseLevel) => {
    switch (courseLevel) {
      case 'beginner':
        return { text: t('courses.filter.beginner'), color: 'success' };
      case 'intermediate':
        return { text: t('courses.filter.intermediate'), color: 'warning' };
      case 'advanced':
        return { text: t('courses.filter.advanced'), color: 'error' };
      default:
        return { text: courseLevel, color: 'default' };
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('courses.title')}
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label={t('courses.search')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('courses.filter.category')}</InputLabel>
              <Select
                value={category}
                label={t('courses.filter.category')}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="all">{t('courses.filter.all')}</MenuItem>
                <MenuItem value="frontend">{t('courses.filter.frontend')}</MenuItem>
                <MenuItem value="backend">{t('courses.filter.backend')}</MenuItem>
                <MenuItem value="database">{t('courses.filter.database')}</MenuItem>
                <MenuItem value="devops">{t('courses.filter.devops')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('courses.filter.level')}</InputLabel>
              <Select
                value={level}
                label={t('courses.filter.level')}
                onChange={(e) => setLevel(e.target.value)}
              >
                <MenuItem value="all">{t('courses.filter.all')}</MenuItem>
                <MenuItem value="beginner">{t('courses.filter.beginner')}</MenuItem>
                <MenuItem value="intermediate">{t('courses.filter.intermediate')}</MenuItem>
                <MenuItem value="advanced">{t('courses.filter.advanced')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      {/* Course List */}
      <Typography variant="h5" gutterBottom>
        {t('courses.all_courses')}
      </Typography>
      
      <Grid container spacing={3}>
        {filteredCourses.map(course => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  cursor: 'pointer'
                }
              }}
              onClick={() => handleCourseClick(course.id)}
            >
              <CardMedia
                component="img"
                height="160"
                image={course.image}
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={getLevelDisplay(course.level).text}
                    color={getLevelDisplay(course.level).color}
                    size="small"
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={course.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {course.rating}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="h6" component="h2" gutterBottom>
                  {course.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph sx={{ height: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {course.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.instructor}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                  <Typography variant="body2" color="text.secondary">
                    {course.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.enrollments} {t('courses.details.enrolled_students')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredCourses.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No courses found matching your criteria.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Courses;
