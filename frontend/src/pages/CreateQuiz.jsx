// File content from above - CreateQuiz.jsx
// src/pages/CreateQuiz.jsx
import React, { useState } from 'react';
import {
  Box, 
  Typography, 
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Radio,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuizGenerator from '../components/QuizGenerator';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Sample course data
const courseData = [
  { id: '1', title: 'JavaScript Fundamentals' },
  { id: '2', title: 'Python for Beginners' },
  { id: '3', title: 'Advanced React' },
  { id: '4', title: 'Node.js & Express' },
];

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState([]);
  
  // Question form state
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [editingIndex, setEditingIndex] = useState(-1);
  
  // Generator dialog state
  const [generatorOpen, setGeneratorOpen] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Handle AI generated questions
  const handleQuestionsGenerated = (newQuestions) => {
    setQuestions([...questions, ...newQuestions]);
    showAlert(`Successfully generated ${newQuestions.length} questions!`, 'success');
  };
  
  // Reset options with one correct
  const resetOptions = () => {
    setOptions([
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
  };
  
  // Add or update question
  const handleAddQuestion = () => {
    if (currentQuestion.trim() === '') {
      showAlert('Question text cannot be empty', 'error');
      return;
    }
    
    // Check if any options are empty
    const emptyOptions = options.filter(opt => opt.text.trim() === '');
    if (emptyOptions.length > 0) {
      showAlert('All options must have text', 'error');
      return;
    }
    
    // Check if at least one option is marked correct
    const hasCorrectOption = options.some(opt => opt.isCorrect);
    if (!hasCorrectOption) {
      showAlert('At least one option must be marked as correct', 'error');
      return;
    }
    
    // If editing existing question
    if (editingIndex >= 0) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = {
        id: updatedQuestions[editingIndex].id,
        question: currentQuestion,
        options: [...options]
      };
      setQuestions(updatedQuestions);
      setEditingIndex(-1);
      showAlert('Question updated successfully', 'success');
    } else {
      // Add new question
      setQuestions([...questions, {
        id: questions.length + 1,
        question: currentQuestion,
        options: [...options]
      }]);
      showAlert('Question added successfully', 'success');
    }
    
    // Reset form
    setCurrentQuestion('');
    resetOptions();
  };
  
  // Handle option correctness
  const handleOptionCorrectChange = (index) => {
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index
    }));
    setOptions(newOptions);
  };
  
  // Handle option text change
  const handleOptionTextChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };
  
  // Edit a question
  const handleEditQuestion = (index) => {
    const questionToEdit = questions[index];
    setCurrentQuestion(questionToEdit.question);
    setOptions([...questionToEdit.options]);
    setEditingIndex(index);
  };
  
  // Delete a question
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    
    // Reassign IDs
    const reindexedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      id: i + 1
    }));
    
    setQuestions(reindexedQuestions);
  };
  
  // Save quiz
  const handleSaveQuiz = () => {
    if (!quizTitle.trim()) {
      showAlert('Quiz title is required', 'error');
      return;
    }
    
    if (!selectedCourse) {
      showAlert('Please select a course', 'error');
      return;
    }
    
    if (questions.length === 0) {
      showAlert('Quiz must have at least one question', 'error');
      return;
    }
    
    // Save quiz logic would go here
    console.log('Saving quiz:', {
      title: quizTitle,
      courseId: selectedCourse,
      description,
      timeLimit,
      passingScore,
      questions
    });
    
    showAlert('Quiz saved successfully!', 'success');
    
    // Navigate back
    setTimeout(() => navigate('/instructor'), 1500);
  };
  
  // Show alert
  const showAlert = (message, severity) => {
    setAlert({
      open: true,
      message,
      severity
    });
  };
  
  // Get course title from ID
  const getCourseTitle = () => {
    const course = courseData.find(c => c.id === selectedCourse);
    return course ? course.title : '';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Create New Quiz</Typography>
      </Box>
      
      {/* Quiz Details */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Quiz Details</Typography>
        
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Quiz Title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            margin="normal"
            required
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Course</InputLabel>
            <Select
              value={selectedCourse}
              label="Course"
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courseData.map(course => (
                <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={2}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="Time Limit (minutes)"
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ flex: 1 }}
            />
            
            <TextField
              label="Passing Score (%)"
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>
      </Paper>
      
      {/* Questions Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Questions ({questions.length})</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AutoAwesomeIcon />}
          onClick={() => setGeneratorOpen(true)}
          disabled={!selectedCourse}
        >
          Generate with AI
        </Button>
      </Box>
      
      {/* Questions List */}
      {questions.length > 0 ? (
        <Paper sx={{ mb: 4 }}>
          <List>
            {questions.map((q, index) => (
              <React.Fragment key={q.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton onClick={() => handleEditQuestion(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteQuestion(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={<Typography variant="subtitle1">{index + 1}. {q.question}</Typography>}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        {q.options.map((opt, optIndex) => (
                          <Box key={optIndex} sx={{ mb: 0.5 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: opt.isCorrect ? 'success.main' : 'text.secondary',
                                fontWeight: opt.isCorrect ? 'bold' : 'normal'
                              }}
                            >
                              {String.fromCharCode(65 + optIndex)}. {opt.text}
                              {opt.isCorrect && ' ✓'}
                            </Typography>
                          </Box>
                        ))}
                        
                        {q.difficulty && (
                          <Chip 
                            size="small" 
                            label={q.difficulty} 
                            color={
                              q.difficulty === 'beginner' ? 'success' :
                              q.difficulty === 'intermediate' ? 'warning' : 'error'
                            }
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center', mb: 4 }}>
          <Typography color="text.secondary">
            No questions added yet. Add questions manually or generate them with AI.
          </Typography>
        </Paper>
      )}
      
      {/* Add/Edit Question Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingIndex >= 0 ? 'Edit Question' : 'Add New Question'}
        </Typography>
        
        <TextField
          fullWidth
          label="Question Text"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          margin="normal"
          multiline
          rows={2}
        />
        
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Options (select one correct answer)
        </Typography>
        
        {options.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Radio
              checked={option.isCorrect}
              onChange={() => handleOptionCorrectChange(index)}
              value={index}
              name="radio-options"
            />
            <TextField
              fullWidth
              label={`Option ${String.fromCharCode(65 + index)}`}
              value={option.text}
              onChange={(e) => handleOptionTextChange(index, e.target.value)}
            />
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          {editingIndex >= 0 && (
            <Button
              variant="outlined"
              onClick={() => {
                setEditingIndex(-1);
                setCurrentQuestion('');
                resetOptions();
              }}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={editingIndex >= 0 ? <SaveIcon /> : <AddIcon />}
            onClick={handleAddQuestion}
          >
            {editingIndex >= 0 ? 'Update Question' : 'Add Question'}
          </Button>
        </Box>
      </Paper>
      
      {/* Save Quiz Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSaveQuiz}
        >
          Save Quiz
        </Button>
      </Box>
      
      {/* Quiz Generator Dialog */}
      <QuizGenerator
        open={generatorOpen}
        onClose={() => setGeneratorOpen(false)}
        onQuestionsGenerated={handleQuestionsGenerated}
        courseTitle={getCourseTitle()}
      />
      
      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({...alert, open: false})}
      >
        <Alert 
          onClose={() => setAlert({...alert, open: false})} 
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}