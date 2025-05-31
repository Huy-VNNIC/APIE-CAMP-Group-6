import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Tabs,
  Tab,
  Paper,
  Rating,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  CardMedia
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LockIcon from '@mui/icons-material/Lock';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';

// Mock course data
const mockCourses = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming language, including syntax, variables, functions, and basic control structures in JavaScript.',
    category: 'frontend',
    level: 'beginner',
    instructor: 'John Smith',
    instructorTitle: 'Senior Frontend Developer',
    instructorBio: 'Instructor with over 5 years of frontend development experience and 3 years teaching JavaScript.',
    image: 'https://placehold.co/600x400/2196f3/fff?text=JavaScript+Basics',
    duration: '12 hours',
    language: 'English',
    rating: 4.5,
    enrollments: 1250,
    lessons: [
      { 
        id: '1-1', 
        title: 'Introduction to JavaScript', 
        duration: '20 min', 
        isPreview: true,
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        description: 'Overview of JavaScript and how it works in web development.'
      },
      { 
        id: '1-2', 
        title: 'Variables and Data Types', 
        duration: '35 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        description: 'Learn how to declare variables and basic data types in JavaScript.'
      },
      { 
        id: '1-3', 
        title: 'Functions in JavaScript', 
        duration: '45 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/xUI5Tsl2JpY',
        description: 'Understanding how to declare and use functions in JavaScript.'
      },
      { 
        id: '1-4', 
        title: 'Control Structures', 
        duration: '40 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/IsG4Xd6LlsM',
        description: 'Learn about if, else, switch statements in JavaScript.'
      },
      { 
        id: '1-5', 
        title: 'Loops', 
        duration: '50 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/s9wW2PpJsmQ',
        description: 'Using for, while, and do-while loops in JavaScript.'
      },
      { 
        id: '1-6', 
        title: 'Arrays and Objects', 
        duration: '60 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/oigfaZ5ApsM',
        description: 'Learn about array and object data structures in JavaScript.'
      },
      { 
        id: '1-7', 
        title: 'DOM and Events', 
        duration: '75 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/0ik6X4DJKCc',
        description: 'How to access and manipulate the DOM, handling events in JavaScript.'
      },
      { 
        id: '1-8', 
        title: 'Asynchronous JavaScript', 
        duration: '65 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/ZYb_ZU8LNxs',
        description: 'Learn about callbacks, Promises, and async/await in JavaScript.'
      }
    ],
    outcomes: [
      'Understand JavaScript syntax and structure',
      'Work with variables, functions, arrays, and objects',
      'Handle events and interact with the DOM',
      'Implement basic JavaScript requirements',
      'Build interactive website features'
    ],
    reviews: [
      { id: 1, user: 'Alex Johnson', rating: 5, comment: 'Great course for beginners, very clear explanations.', date: '2023-03-15' },
      { id: 2, user: 'Sarah Williams', rating: 4, comment: 'Enthusiastic instructor, detailed explanations. Could use more exercises though.', date: '2023-04-22' },
      { id: 3, user: 'Michael Brown', rating: 5, comment: 'Completed the course and now feel confident with JavaScript.', date: '2023-05-10' }
    ],
    relatedVideos: [
      {
        id: 'rv1',
        title: 'JavaScript Crash Course For Beginners',
        videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy3c',
        thumbnail: 'https://img.youtube.com/vi/hdI2bqOjy3c/hqdefault.jpg'
      },
      {
        id: 'rv2',
        title: 'JavaScript DOM Manipulation',
        videoUrl: 'https://www.youtube.com/embed/y17RuWkWdn8',
        thumbnail: 'https://img.youtube.com/vi/y17RuWkWdn8/hqdefault.jpg'
      }
    ],
    assignments: [
      {
        id: 'a1',
        title: 'JavaScript - Arrays and Objects Exercise',
        description: 'Practice using array methods and working with objects in JavaScript',
        dueDate: '06/01/2023'
      },
      {
        id: 'a2',
        title: 'JavaScript - Final Project',
        description: 'Build a Todo List application using JavaScript, HTML, and CSS',
        dueDate: '06/15/2023'
      }
    ]
  },
  {
    id: '2',
    title: 'Python for Beginners',
    description: 'Learn Python from basics to advanced with practical examples, suitable for people with no programming experience.',
    category: 'backend',
    level: 'beginner',
    instructor: 'Emily Parker',
    instructorTitle: 'Python Developer | Data Scientist',
    instructorBio: 'Python expert with 7 years of experience and author of multiple online courses.',
    image: 'https://placehold.co/600x400/4caf50/fff?text=Python+For+Beginners',
    duration: '15 hours',
    language: 'English',
    rating: 4.8,
    enrollments: 980,
    lessons: [
      { 
        id: '2-1', 
        title: 'Introduction to Python and Setup', 
        duration: '30 min', 
        isPreview: true,
        videoUrl: 'https://www.youtube.com/embed/x7X9w_GIm1s',
        description: 'Overview of Python and how to set up your development environment.'
      },
      { 
        id: '2-2', 
        title: 'Variables and Data Types in Python', 
        duration: '45 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/cQT33yu9pY8',
        description: 'Learn how to declare variables and basic data types in Python.'
      },
      { 
        id: '2-3', 
        title: 'Control Structures', 
        duration: '50 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/sVJWFIVbi5g',
        description: 'Learn about if-else, while, and for control structures in Python.'
      },
      { 
        id: '2-4', 
        title: 'Functions in Python', 
        duration: '60 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/NzSCNjn4_RI',
        description: 'Learn how to define and use functions in Python.'
      },
      { 
        id: '2-5', 
        title: 'Lists, Tuples, Dictionaries, and Sets', 
        duration: '75 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/W8KRzm-HUcc',
        description: 'Learn about data structures in Python.'
      },
      { 
        id: '2-6', 
        title: 'File Handling and Exceptions', 
        duration: '55 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/3qtEmpIkGGY',
        description: 'Learn how to read/write files and handle exceptions in Python.'
      },
      { 
        id: '2-7', 
        title: 'Object-Oriented Programming with Python', 
        duration: '90 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/JeznW_7DlB0',
        description: 'Learn about object-oriented programming and how to implement it in Python.'
      },
      { 
        id: '2-8', 
        title: 'Modules and Packages', 
        duration: '45 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/LHU5BIwpJ9s',
        description: 'Learn how to organize code using modules and packages in Python.'
      },
      { 
        id: '2-9', 
        title: 'Python Standard Library', 
        duration: '60 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/CXZYvNRIAKM',
        description: 'Explore useful standard libraries in Python.'
      }
    ],
    outcomes: [
      'Master basic Python programming language',
      'Understand and apply object-oriented programming concepts',
      'Work with files and handle exceptions',
      'Build simple console applications',
      'Know how to use popular Python libraries'
    ],
    reviews: [
      { id: 1, user: 'David Wilson', rating: 5, comment: 'Detailed and easy to understand. I started from zero and now I can write Python programs.', date: '2023-01-20' },
      { id: 2, user: 'Jennifer Lee', rating: 5, comment: 'Instructor teaches very enthusiastically and clearly. Rich course content.', date: '2023-02-15' },
      { id: 3, user: 'Robert Clark', rating: 4, comment: 'Good course, but would be better with more complex practical exercises.', date: '2023-03-05' }
    ],
    relatedVideos: [
      {
        id: 'rv1',
        title: 'Python Full Course for Beginners',
        videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
        thumbnail: 'https://img.youtube.com/vi/_uQrJ0TkZlc/hqdefault.jpg'
      },
      {
        id: 'rv2',
        title: 'Python Project Tutorial - Build A Sudoku Solver',
        videoUrl: 'https://www.youtube.com/embed/eqUwSA0xI-s',
        thumbnail: 'https://img.youtube.com/vi/eqUwSA0xI-s/hqdefault.jpg'
      },
      {
        id: 'rv3',
        title: 'Python for Data Science - Full Course for Beginners',
        videoUrl: 'https://www.youtube.com/embed/LHBE6Q9XlzI',
        thumbnail: 'https://img.youtube.com/vi/LHBE6Q9XlzI/hqdefault.jpg'
      }
    ],
    assignments: [
      {
        id: 'a1',
        title: 'Python - Data Structures Exercise',
        description: 'Practice with Lists, Dictionaries and Sets in Python',
        dueDate: '06/05/2023'
      },
      {
        id: 'a2',
        title: 'Python - Final Project',
        description: 'Build a simple Library Management System with Python',
        dueDate: '06/15/2023'
      }
    ]
  },
  {
    id: '3',
    title: 'Advanced React',
    description: 'Deep dive into React.js and learn how to build professional, scalable applications with advanced patterns and best practices.',
    category: 'frontend',
    level: 'advanced',
    instructor: 'Leo Chen',
    instructorTitle: 'Senior React Developer',
    instructorBio: 'React specialist with 8+ years of frontend development experience and author of "Mastering React" book.',
    image: 'https://placehold.co/600x400/ff5722/fff?text=Advanced+React',
    duration: '18 hours',
    language: 'English',
    rating: 4.7,
    enrollments: 735,
    lessons: [
      { 
        id: '3-1', 
        title: 'Advanced React Concepts', 
        duration: '45 min', 
        isPreview: true,
        videoUrl: 'https://www.youtube.com/embed/4UZrsTqkcW4',
        description: 'Overview of advanced React concepts and what we\'ll cover in the course.'
      },
      { 
        id: '3-2', 
        title: 'React Hooks Deep Dive', 
        duration: '80 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q',
        description: 'Detailed exploration of React Hooks including useEffect, useCallback, useMemo, and custom hooks.'
      },
      { 
        id: '3-3', 
        title: 'Context API and State Management', 
        duration: '70 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/35lXWvCuM8o',
        description: 'Learn effective state management strategies with Context API, useReducer, and when to use Redux.'
      },
      { 
        id: '3-4', 
        title: 'Performance Optimization', 
        duration: '90 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/5BHvOGjcOJ4',
        description: 'Techniques for optimizing React app performance including React.memo, useCallback, useMemo, and code splitting.'
      },
      { 
        id: '3-5', 
        title: 'Advanced Component Patterns', 
        duration: '85 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/WV0UUcSPk-0',
        description: 'Learn advanced component patterns including Compound Components, Render Props, HOCs, and Custom Hooks.'
      },
      { 
        id: '3-6', 
        title: 'Testing React Components', 
        duration: '75 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/ZmVBCpefQe8',
        description: 'Comprehensive guide to testing React applications with React Testing Library and Jest.'
      },
      { 
        id: '3-7', 
        title: 'Server Side Rendering', 
        duration: '95 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/7ukbvBZ_XGo',
        description: 'Implementing Server-Side Rendering (SSR) with Next.js for React applications.'
      },
      { 
        id: '3-8', 
        title: 'React Design Systems', 
        duration: '80 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/_XbEX5kuATY',
        description: 'Building scalable design systems with styled-components and other styling approaches.'
      }
    ],
    outcomes: [
      'Master advanced React concepts and hooks',
      'Build performant and scalable React applications',
      'Implement complex state management solutions',
      'Write effective tests for React components',
      'Create reusable component libraries and design systems',
      'Optimize React applications for production'
    ],
    reviews: [
      { id: 1, user: 'Jessica Kumar', rating: 5, comment: 'This course took my React skills to the next level. Extremely valuable content.', date: '2023-02-12' },
      { id: 2, user: 'Thomas Anderson', rating: 4, comment: 'Great advanced techniques covered, particularly liked the performance optimization section.', date: '2023-03-18' },
      { id: 3, user: 'Maria Lopez', rating: 5, comment: 'The component patterns section alone was worth the price of the course. Excellent teaching.', date: '2023-05-05' }
    ],
    relatedVideos: [
      {
        id: 'rv1',
        title: 'React Performance Optimization Tips',
        videoUrl: 'https://www.youtube.com/embed/Aie15ANUvGg',
        thumbnail: 'https://img.youtube.com/vi/Aie15ANUvGg/hqdefault.jpg'
      },
      {
        id: 'rv2',
        title: 'Advanced React Patterns',
        videoUrl: 'https://www.youtube.com/embed/SaLXzbgGjL0',
        thumbnail: 'https://img.youtube.com/vi/SaLXzbgGjL0/hqdefault.jpg'
      }
    ],
    assignments: [
      {
        id: 'a1',
        title: 'Custom Hooks Library',
        description: 'Create a collection of useful custom hooks that solve real-world problems',
        dueDate: '07/10/2023'
      },
      {
        id: 'a2',
        title: 'E-commerce Dashboard',
        description: 'Build an advanced e-commerce admin dashboard using React and context API',
        dueDate: '08/05/2023'
      }
    ]
  },
  {
    id: '4',
    title: 'Node.js & Express',
    description: 'Learn how to build scalable and robust RESTful APIs using Node.js and Express framework with industry best practices.',
    category: 'backend',
    level: 'intermediate',
    instructor: 'Priya Sharma',
    instructorTitle: 'Backend Developer | API Specialist',
    instructorBio: 'Backend developer with 6 years of experience building Node.js applications at scale for Fortune 500 companies.',
    image: 'https://placehold.co/600x400/9c27b0/fff?text=Node.js+Express',
    duration: '16 hours',
    language: 'English',
    rating: 4.6,
    enrollments: 850,
    lessons: [
      { 
        id: '4-1', 
        title: 'Node.js Fundamentals', 
        duration: '50 min', 
        isPreview: true,
        videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4',
        description: 'Understanding Node.js architecture, event loop, and core modules.'
      },
      { 
        id: '4-2', 
        title: 'Express.js Introduction', 
        duration: '65 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/L72fhGm1tfE',
        description: 'Setting up Express.js and creating your first REST API endpoints.'
      },
      { 
        id: '4-3', 
        title: 'Middleware and Request Processing', 
        duration: '70 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/lY6icfhap2o',
        description: 'Understanding middleware functions and how to process HTTP requests effectively.'
      },
      { 
        id: '4-4', 
        title: 'RESTful API Design Principles', 
        duration: '80 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/UM-i5Fo_ujU',
        description: 'Best practices for designing RESTful APIs, including resource naming and HTTP methods.'
      },
      { 
        id: '4-5', 
        title: 'Database Integration with MongoDB', 
        duration: '90 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/vjf774RKrLc',
        description: 'Connecting your Express app to MongoDB using Mongoose ODM.'
      },
      { 
        id: '4-6', 
        title: 'Authentication and Authorization', 
        duration: '85 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/2jqok-WgelI',
        description: 'Implementing JWT-based authentication and role-based access control.'
      },
      { 
        id: '4-7', 
        title: 'Error Handling and Validation', 
        duration: '60 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/qQg_VTVI_zk',
        description: 'Building robust error handling and request validation mechanisms.'
      },
      { 
        id: '4-8', 
        title: 'Testing Node.js Applications', 
        duration: '75 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/FKnzS_icp20',
        description: 'Writing unit and integration tests for Node.js APIs using Jest and Supertest.'
      },
      { 
        id: '4-9', 
        title: 'API Documentation and Deployment', 
        duration: '65 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/fsCjFHuMXj0',
        description: 'Documenting your API with Swagger/OpenAPI and deploying to production environments.'
      }
    ],
    outcomes: [
      'Build RESTful APIs using Node.js and Express',
      'Implement authentication and authorization systems',
      'Connect to databases and perform CRUD operations',
      'Handle errors effectively and validate incoming data',
      'Test and document your APIs professionally',
      'Deploy Node.js applications to production'
    ],
    reviews: [
      { id: 1, user: 'James Wilson', rating: 5, comment: 'One of the best Node.js courses I\'ve taken. Very practical and hands-on.', date: '2023-01-15' },
      { id: 2, user: 'Sophia Chen', rating: 4, comment: 'Great examples and clear explanations. The section on authentication was particularly helpful.', date: '2023-02-22' },
      { id: 3, user: 'Daniel Kim', rating: 5, comment: 'This course gave me the confidence to build and deploy my own API. Highly recommended!', date: '2023-04-10' }
    ],
    relatedVideos: [
      {
        id: 'rv1',
        title: 'Node.js Crash Course',
        videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4',
        thumbnail: 'https://img.youtube.com/vi/fBNz5xF-Kx4/hqdefault.jpg'
      },
      {
        id: 'rv2',
        title: 'JWT Authentication Tutorial',
        videoUrl: 'https://www.youtube.com/embed/7nafaH9SddU',
        thumbnail: 'https://img.youtube.com/vi/7nafaH9SddU/hqdefault.jpg'
      }
    ],
    assignments: [
      {
        id: 'a1',
        title: 'RESTful Blog API',
        description: 'Implement a complete blog API with CRUD operations and authentication',
        dueDate: '07/15/2023'
      },
      {
        id: 'a2',
        title: 'E-commerce API Project',
        description: 'Build a robust e-commerce API with product catalog, user cart, and checkout functionality',
        dueDate: '08/10/2023'
      }
    ]
  },
  {
    id: '5',
    title: 'MongoDB Basics',
    description: 'Learn the fundamentals of NoSQL databases through MongoDB, including data modeling, CRUD operations, and integration with applications.',
    category: 'database',
    level: 'beginner',
    instructor: 'Howard Zhang',
    instructorTitle: 'Database Architect | MongoDB Expert',
    instructorBio: 'Database specialist with 10+ years of experience and MongoDB certified professional who has designed data solutions for startups and enterprises.',
    image: 'https://placehold.co/600x400/795548/fff?text=MongoDB+Basics',
    duration: '12 hours',
    language: 'English',
    rating: 4.3,
    enrollments: 620,
    lessons: [
      { 
        id: '5-1', 
        title: 'Introduction to NoSQL and MongoDB', 
        duration: '45 min', 
        isPreview: true,
        videoUrl: 'https://www.youtube.com/embed/pWbMrx5rVBE',
        description: 'Understanding NoSQL databases and where MongoDB fits in the database landscape.'
      },
      { 
        id: '5-2', 
        title: 'Setting Up MongoDB Environment', 
        duration: '50 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/FwMwO8pXfq0',
        description: 'Installing and configuring MongoDB on different platforms and using MongoDB Atlas.'
      },
      { 
        id: '5-3', 
        title: 'CRUD Operations in MongoDB', 
        duration: '75 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/VFxQJ2EQjAg',
        description: 'Performing Create, Read, Update, and Delete operations in MongoDB.'
      },
      { 
        id: '5-4', 
        title: 'MongoDB Data Modeling', 
        duration: '80 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/3GHZd0zv170',
        description: 'Best practices for designing document schemas and data models in MongoDB.'
      },
      { 
        id: '5-5', 
        title: 'Querying MongoDB', 
        duration: '85 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/jJlWCePwsVk',
        description: 'Advanced query operators, filtering, and projection techniques.'
      },
      { 
        id: '5-6', 
        title: 'Indexing and Performance', 
        duration: '70 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/wT0_ktAZbBg',
        description: 'Creating and optimizing indexes, understanding query performance.'
      },
      { 
        id: '5-7', 
        title: 'MongoDB Aggregation Framework', 
        duration: '90 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/Kk6Er0c7srU',
        description: 'Using the aggregation framework for data transformation and analysis.'
      },
      { 
        id: '5-8', 
        title: 'MongoDB with Node.js', 
        duration: '65 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/SnqPyqRh4r4',
        description: 'Connecting MongoDB to Node.js applications using the native driver and Mongoose.'
      }
    ],
    outcomes: [
      'Understand NoSQL database concepts',
      'Perform CRUD operations in MongoDB',
      'Design efficient MongoDB data models',
      'Create and optimize indexes for performance',
      'Use the MongoDB aggregation framework',
      'Integrate MongoDB with applications',
      'Implement data validation and security measures'
    ],
    reviews: [
      { id: 1, user: 'Emma Davis', rating: 4, comment: 'Great introduction to MongoDB. The examples were practical and easy to follow.', date: '2023-02-05' },
      { id: 2, user: 'Li Wei', rating: 5, comment: 'This course helped me transition from SQL to NoSQL thinking. Very comprehensive coverage.', date: '2023-03-12' },
      { id: 3, user: 'Marcus Johnson', rating: 4, comment: 'Solid foundation in MongoDB. Would like to see more advanced topics in a sequel course.', date: '2023-04-18' }
    ],
    relatedVideos: [
      {
        id: 'rv1',
        title: 'MongoDB Crash Course',
        videoUrl: 'https://www.youtube.com/embed/2QQGWYe7IDU',
        thumbnail: 'https://img.youtube.com/vi/2QQGWYe7IDU/hqdefault.jpg'
      },
      {
        id: 'rv2',
        title: 'MongoDB Schema Design Best Practices',
        videoUrl: 'https://www.youtube.com/embed/QAqK-R9HUhc',
        thumbnail: 'https://img.youtube.com/vi/QAqK-R9HUhc/hqdefault.jpg'
      }
    ],
    assignments: [
      {
        id: 'a1',
        title: 'Data Modeling Exercise',
        description: 'Design an optimal document schema for an e-commerce application',
        dueDate: '06/20/2023'
      },
      {
        id: 'a2',
        title: 'MongoDB CRUD Application',
        description: 'Build a simple application that performs CRUD operations on a MongoDB database',
        dueDate: '07/05/2023'
      }
    ]
  },
  {
    id: '6',
    title: 'AWS for Developers',
    description: 'Learn how to deploy, scale, and manage applications on AWS cloud platform using industry best practices and architecture patterns.',
    category: 'devops',
    level: 'intermediate',
    instructor: 'Fiona Reynolds',
    instructorTitle: 'AWS Certified Solutions Architect | DevOps Engineer',
    instructorBio: 'Cloud computing expert with 9+ years of AWS experience, having helped dozens of companies migrate to and optimize their cloud infrastructure.',
    image: 'https://placehold.co/600x400/607d8b/fff?text=AWS+for+Developers',
    duration: '20 hours',
    language: 'English',
    rating: 4.9,
    enrollments: 475,
    lessons: [
      { 
        id: '6-1', 
        title: 'AWS Fundamentals and Core Services', 
        duration: '60 min', 
        isPreview: true,
        videoUrl: 'https://www.youtube.com/embed/ulprqHHWlng',
        description: 'Introduction to AWS platform and overview of core services like EC2, S3, and RDS.'
      },
      { 
        id: '6-2', 
        title: 'AWS Identity and Access Management (IAM)', 
        duration: '70 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/erJpjL2iiDw',
        description: 'Implementing security best practices with IAM users, roles, policies, and permissions.'
      },
      { 
        id: '6-3', 
        title: 'Compute Services: EC2, Lambda, and ECS', 
        duration: '90 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/lZMkgOMYYIg',
        description: 'Deploying applications using different compute options on AWS.'
      },
      { 
        id: '6-4', 
        title: 'Storage Solutions: S3, EBS, and EFS', 
        duration: '80 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/77lMCiiMilo',
        description: 'Managing data storage with various AWS storage services.'
      },
      { 
        id: '6-5', 
        title: 'Database Services: RDS, DynamoDB, and ElastiCache', 
        duration: '85 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/_y8xQM_cLQQ',
        description: 'Implementing database solutions on AWS for different use cases.'
      },
      { 
        id: '6-6', 
        title: 'Application Integration: SQS, SNS, and API Gateway', 
        duration: '75 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/lHRgT2q-yVs',
        description: 'Building decoupled and event-driven architectures on AWS.'
      },
      { 
        id: '6-7', 
        title: 'Serverless Applications with AWS', 
        duration: '95 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/0-7nxlrPSUc',
        description: 'Building and deploying serverless applications using Lambda, API Gateway, and DynamoDB.'
      },
      { 
        id: '6-8', 
        title: 'DevOps on AWS: CI/CD Pipeline', 
        duration: '85 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/NwzJCSPSPZs',
        description: 'Implementing continuous integration and delivery using AWS Developer Tools.'
      },
      { 
        id: '6-9', 
        title: 'Monitoring and Debugging on AWS', 
        duration: '70 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/a4dhoTQCyRA',
        description: 'Using CloudWatch, X-Ray, and other tools to monitor and troubleshoot applications.'
      },
      { 
        id: '6-10', 
        title: 'Cost Optimization and Best Practices', 
        duration: '60 min', 
        isPreview: false,
        videoUrl: 'https://www.youtube.com/embed/YlQCyrX0tmQ',
        description: 'Strategies for optimizing costs and implementing AWS Well-Architected Framework.'
      }
    ],
    outcomes: [
      'Deploy applications on AWS using best practices',
      'Design scalable and resilient cloud architectures',
      'Implement security measures and IAM policies',
      'Build serverless applications with AWS services',
      'Create automated CI/CD pipelines for deployment',
      'Monitor and troubleshoot AWS applications',
      'Optimize AWS resource usage and costs'
    ],
    reviews: [
      { id: 1, user: 'Peter Gonzalez', rating: 5, comment: 'Exceptional course that helped me pass my AWS certification. The real-world examples were invaluable.', date: '2023-02-28' },
      { id: 2, user: 'Nina Patel', rating: 5, comment: 'As a developer moving to the cloud, this course gave me everything I needed to confidently deploy on AWS.', date: '2023-03-17' },
      { id: 3, user: 'Ryan Thompson', rating: 5, comment: 'The serverless section alone was worth the cost of the entire course. Extremely practical and up-to-date content.', date: '2023-04-25' }
    ],
    relatedVideos: [
      {
        id: 'rv1',
        title: 'AWS Services Overview for Developers',
        videoUrl: 'https://www.youtube.com/embed/Z3SYDTMP3ME',
        thumbnail: 'https://img.youtube.com/vi/Z3SYDTMP3ME/hqdefault.jpg'
      },
      {
        id: 'rv2',
        title: 'Serverless Architecture on AWS',
        videoUrl: 'https://www.youtube.com/embed/G_xxK-7zWeA',
        thumbnail: 'https://img.youtube.com/vi/G_xxK-7zWeA/hqdefault.jpg'
      },
      {
        id: 'rv3',
        title: 'AWS DevOps CI/CD Pipeline Tutorial',
        videoUrl: 'https://www.youtube.com/embed/nyWzkHEh9YE',
        thumbnail: 'https://img.youtube.com/vi/nyWzkHEh9YE/hqdefault.jpg'
      }
    ],
    assignments: [
      {
        id: 'a1',
        title: 'Serverless Web Application',
        description: 'Build and deploy a serverless web application using AWS Lambda, API Gateway, and S3',
        dueDate: '07/25/2023'
      },
      {
        id: 'a2',
        title: 'CI/CD Pipeline Project',
        description: 'Implement a complete CI/CD pipeline for a multi-tier application using AWS DevOps tools',
        dueDate: '08/15/2023'
      }
    ]
  }
];

// The rest of your file remains unchanged
