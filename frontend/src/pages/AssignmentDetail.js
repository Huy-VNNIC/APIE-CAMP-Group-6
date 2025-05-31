import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

// Icons
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Dummy assignment data - would come from API in real app
const mockAssignments = [
  {
    id: '1',
    title: 'JavaScript - Bài tập Arrays và Objects',
    description: 'Thực hành các phương thức của Array và cách làm việc với Objects trong JavaScript',
    language: 'JavaScript',
    dueDate: '01/06/2023',
    progress: 35,
    status: 'open',
    courseId: '1',
    courseName: 'JavaScript Cơ bản',
    instructions: `
# JavaScript Arrays và Objects

Trong bài tập này, bạn sẽ thực hành làm việc với Arrays và Objects trong JavaScript.

## Phần 1: Arrays

1. Tạo một mảng chứa tên các loại trái cây
2. Thêm một phần tử vào cuối mảng
3. Xóa phần tử đầu tiên của mảng
4. Sử dụng phương thức map() để tạo một mảng mới chứa độ dài của từng tên trái cây

## Phần 2: Objects

1. Tạo một object student với các thông tin: name, age, grades
2. Thêm một phương thức để tính điểm trung bình
3. Sử dụng object destructuring để lấy các giá trị từ object

## Nộp bài

Viết code của bạn trong phần Code Playground và nộp khi hoàn thành.
`,
    codeTemplate: `// Phần 1: Arrays
// 1. Tạo một mảng chứa tên các loại trái cây
const fruits = [];

// 2. Thêm một phần tử vào cuối mảng

// 3. Xóa phần tử đầu tiên của mảng

// 4. Sử dụng phương thức map() để tạo một mảng mới chứa độ dài của từng tên trái cây
const fruitLengths = null;

// Phần 2: Objects
// 1. Tạo một object student
const student = {};

// 2. Thêm một phương thức để tính điểm trung bình
student.calculateAverage = function() {
  // Your code here
};

// 3. Sử dụng object destructuring để lấy các giá trị từ object

// Xuất ra kết quả để kiểm tra
module.exports = function() {
  return {
    fruits,
    fruitLengths,
    student,
    // Gọi phương thức tính điểm trung bình
    avgGrade: student.calculateAverage()
  };
};`
  },
  {
    id: '2',
    title: 'Python - Project cuối khóa',
    description: 'Xây dựng ứng dụng quản lý thư viện đơn giản với Python và SQLite',
    language: 'Python',
    dueDate: '15/06/2023', 
    progress: 10,
    status: 'open',
    courseId: '2',
    courseName: 'Python cho người mới bắt đầu',
    instructions: `
# Python Library Management System

Trong project này, bạn sẽ xây dựng một hệ thống quản lý thư viện đơn giản bằng Python, sử dụng SQLite để lưu trữ dữ liệu.

## Yêu cầu

1. Tạo một cơ sở dữ liệu SQLite với các bảng:
   - Books (id, title, author, year, status)
   - Members (id, name, email, join_date)
   - Loans (id, book_id, member_id, loan_date, return_date)

2. Tạo các chức năng:
   - Thêm, sửa, xóa sách
   - Thêm, sửa, xóa thành viên
   - Mượn và trả sách
   - Tìm kiếm sách theo tên hoặc tác giả
   - Hiển thị sách đang được mượn

3. Tạo một giao diện dòng lệnh đơn giản để tương tác với hệ thống

## Nộp bài

Viết code của bạn và nộp thành file ZIP hoặc qua GitHub repository.
`,
    codeTemplate: `# Python Library Management System
import sqlite3
from datetime import datetime

# Database setup
def setup_database():
    conn = sqlite3.connect('library.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        year INTEGER,
        status TEXT DEFAULT 'available'
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        join_date TEXT
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS loans (
        id INTEGER PRIMARY KEY,
        book_id INTEGER,
        member_id INTEGER,
        loan_date TEXT,
        return_date TEXT,
        FOREIGN KEY (book_id) REFERENCES books (id),
        FOREIGN KEY (member_id) REFERENCES members (id)
    )
    ''')
    
    conn.commit()
    return conn, cursor

# Book functions
def add_book(cursor, conn, title, author, year):
    cursor.execute('''
    INSERT INTO books (title, author, year, status)
    VALUES (?, ?, ?, 'available')
    ''', (title, author, year))
    conn.commit()
    return cursor.lastrowid

def search_books(cursor, search_term):
    cursor.execute('''
    SELECT * FROM books
    WHERE title LIKE ? OR author LIKE ?
    ''', (f'%{search_term}%', f'%{search_term}%'))
    return cursor.fetchall()

# Member functions
def add_member(cursor, conn, name, email):
    join_date = datetime.now().strftime('%Y-%m-%d')
    cursor.execute('''
    INSERT INTO members (name, email, join_date)
    VALUES (?, ?, ?)
    ''', (name, email, join_date))
    conn.commit()
    return cursor.lastrowid

# Loan functions
def loan_book(cursor, conn, book_id, member_id):
    # Check if book is available
    cursor.execute('SELECT status FROM books WHERE id = ?', (book_id,))
    result = cursor.fetchone()
    if not result or result[0] != 'available':
        return False
        
    loan_date = datetime.now().strftime('%Y-%m-%d')
    
    # Update book status
    cursor.execute('''
    UPDATE books SET status = 'loaned' WHERE id = ?
    ''', (book_id,))
    
    # Create loan record
    cursor.execute('''
    INSERT INTO loans (book_id, member_id, loan_date, return_date)
    VALUES (?, ?, ?, NULL)
    ''', (book_id, member_id, loan_date))
    
    conn.commit()
    return True

def return_book(cursor, conn, book_id):
    # Update book status
    cursor.execute('''
    UPDATE books SET status = 'available' WHERE id = ?
    ''', (book_id,))
    
    # Update loan record
    return_date = datetime.now().strftime('%Y-%m-%d')
    cursor.execute('''
    UPDATE loans
    SET return_date = ?
    WHERE book_id = ? AND return_date IS NULL
    ''', (return_date, book_id))
    
    conn.commit()
    return True

# Main function
def main():
    conn, cursor = setup_database()
    print("Library Management System")
    # Add your CLI interface here
    
    # Test data
    add_book(cursor, conn, "Python Programming", "John Smith", 2020)
    add_member(cursor, conn, "Alice Jones", "alice@example.com")
    
    conn.close()

if __name__ == "__main__":
    main()
`
  }
];

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  
  // Calculate days remaining
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate.split('/').reverse().join('-'));
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get status based on days remaining
  const getStatus = (daysRemaining) => {    
    if (daysRemaining < 0) {
      return { label: t('assignments.overdue'), color: 'error' };
    } else if (daysRemaining <= 2) {
      return { label: t('assignments.urgent'), color: 'error' };
    } else if (daysRemaining <= 7) {
      return { label: t('assignments.upcoming'), color: 'warning' };
    } else {
      return { label: t('assignments.open'), color: 'success' };
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return new Date(`${year}-${month}-${day}`).toLocaleDateString('vi-VN', options);
    }
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  
  // Fetch assignment data
  useEffect(() => {
    setLoading(true);
    
    // Simulating API call with timeout
    setTimeout(() => {
      const foundAssignment = mockAssignments.find(a => a.id === id);
      
      if (foundAssignment) {
        setAssignment(foundAssignment);
        // Load saved notes from localStorage if they exist
        const savedNotes = localStorage.getItem(`assignment_notes_${id}`);
        if (savedNotes) {
          setNotes(savedNotes);
        }
      } else {
        setError('Không tìm thấy bài tập');
      }
      
      setLoading(false);
    }, 500);
  }, [id]);
  
  // Save notes to localStorage when they change
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(`assignment_notes_${id}`, newNotes);
  };
  
  // Navigate to playground with assignment data
  const handleStartAssignment = () => {
    navigate(`/playground?assignment=${assignment.id}&language=${assignment.language.toLowerCase()}`);
  };
  
  // Navigate back to assignments
  const handleBackToAssignments = () => {
    navigate('/assignments');
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!assignment) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        {t('assignments.not_found')}
      </Alert>
    );
  }
  
  // Calculate days remaining and status
  const daysRemaining = calculateDaysRemaining(assignment.dueDate);
  const status = getStatus(daysRemaining);
  
  return (
    <Box>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={handleBackToAssignments}
          sx={{ mr: 1 }}
          aria-label="back to assignments"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {assignment.title}
        </Typography>
      </Box>
      
      {/* Assignment details section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t('assignments.details')}
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              {assignment.description}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {t('assignments.due_date')}: {formatDate(assignment.dueDate)}
                </Typography>
              </Box>
              
              <Chip 
                label={status.label}
                color={status.color}
                size="small"
              />
              
              <Chip 
                label={assignment.language}
                variant="outlined"
                size="small"
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {assignment.courseName}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 3, mb: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t('assignments.progress')}:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={assignment.progress} 
                    sx={{ height: 10, borderRadius: 1 }}
                  />
                </Box>
                <Typography variant="body2">
                  {assignment.progress}%
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('assignments.actions')}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<CodeIcon />}
                  onClick={handleStartAssignment}
                  sx={{ mb: 2 }}
                >
                  {assignment.progress > 0 ? 
                    t('assignments.continue') : 
                    t('assignments.start')
                  }
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<SchoolIcon />}
                  onClick={() => navigate(`/courses/${assignment.courseId}`)}
                >
                  {t('assignments.view_course')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Instructions section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t('assignments.instructions')}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ 
              '& pre': {
                backgroundColor: '#f5f5f5',
                p: 1.5,
                borderRadius: 1,
                overflowX: 'auto',
              },
              '& h1, & h2, & h3': {
                mt: 2,
                mb: 1,
              },
              '& ul, & ol': {
                pl: 2,
              }
            }}>
              <ReactMarkdown>
                {assignment.instructions}
              </ReactMarkdown>
            </Box>
          </Paper>
          
          {/* Code template preview */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                {t('assignments.code_template')}
              </Typography>
              <Button 
                variant="contained"
                color="primary"
                startIcon={<CodeIcon />}
                onClick={handleStartAssignment}
              >
                {t('assignments.open_in_playground')}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ 
              bgcolor: '#f5f5f5', 
              p: 2, 
              borderRadius: 1,
              fontFamily: '"Courier New", monospace',
              fontSize: '0.9rem',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              <pre style={{ margin: 0 }}>
                {assignment.codeTemplate}
              </pre>
            </Box>
          </Paper>
        </Grid>
        
        {/* Notes section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('assignments.my_notes')}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              placeholder={t('assignments.notes_placeholder')}
              value={notes}
              onChange={handleNotesChange}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {t('assignments.notes_saved')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssignmentDetail;
