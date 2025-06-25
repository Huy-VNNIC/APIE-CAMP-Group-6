import React, { useState } from 'react';
// import useEffect - removed unused import
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  // FormControlLabel, // Removed unused import
  Radio,
  // RadioGroup, // Removed unused import
  Grid,
  Chip,
  CircularProgress,
  // Accordion, // Removed unused import
  // AccordionSummary, // Removed unused import
  // AccordionDetails, // Removed unused import
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Removed unused import
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Sample course data
const courseData = [
  { id: '1', title: 'JavaScript Fundamentals' },
  { id: '2', title: 'Python for Beginners' },
  { id: '3', title: 'Advanced React' },
  { id: '4', title: 'Node.js & Express' },
  { id: '5', title: 'MongoDB Basics' },
  { id: '6', title: 'AWS for Developers' }
];

// Mock function to call OpenAI API (in a real app, this would be a server-side call)
const generateQuestionsWithAI = async (courseTitle, numberOfQuestions, difficulty) => {
  console.log(`Generating ${numberOfQuestions} ${difficulty} questions for ${courseTitle}...`);
  
  // In a real application, we would make an API call to OpenAI here
  // This is a simplified mock that returns after a delay
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock response structure similar to what OpenAI would return
      const mockQuestions = [];
      
      const difficultyFactors = {
        beginner: {
          options: 3,
          complexity: 'basic concepts',
          topics: ['variables', 'syntax', 'basic operations']
        },
        intermediate: {
          options: 4,
          complexity: 'intermediate concepts',
          topics: ['functions', 'objects', 'error handling']
        },
        advanced: {
          options: 4,
          complexity: 'advanced concepts',
          topics: ['closures', 'promises', 'design patterns']
        }
      };
      
      const factor = difficultyFactors[difficulty];
      
      // Create mock questions based on course and difficulty
      for (let i = 1; i <= numberOfQuestions; i++) {
        const topic = factor.topics[i % factor.topics.length];
        const questionText = `What is the correct way to implement ${topic} in ${courseTitle}?`;
        
        const options = [];
        let correctOption = Math.floor(Math.random() * factor.options);
        
        for (let j = 0; j < factor.options; j++) {
          options.push({
            text: j === correctOption 
              ? `The correct implementation of ${topic}` 
              : `Incorrect implementation ${j} of ${topic}`,
            isCorrect: j === correctOption
          });
        }
        
        mockQuestions.push({
          id: i,
          question: questionText,
          options: options,
          difficulty: difficulty
        });
      }
      
      resolve(mockQuestions);
    }, 2000); // Simulate API delay
  });
};

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [editingIndex, setEditingIndex] = useState(-1);
  
  // AI generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [openAIDialog, setOpenAIDialog] = useState(false);
  const [numQuestionsToGenerate, setNumQuestionsToGenerate] = useState(5);
  const [difficulty, setDifficulty] = useState('intermediate');
  
  // Alerts
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
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
  
  // Save the quiz
  const handleSaveQuiz = () => {
    if (quizTitle.trim() === '') {
      showAlert('Quiz title is required', 'error');
      return;
    }
    
    if (selectedCourse === '') {
      showAlert('Please select a course', 'error');
      return;
    }
    
    if (questions.length === 0) {
      showAlert('Quiz must have at least one question', 'error');
      return;
    }
    
    // In a real app, this would save the quiz to a database
    console.log('Saving quiz:', {
      title: quizTitle,
      course: selectedCourse,
      description,
      timeLimit,
      passingScore,
      questions
    });
    
    showAlert('Quiz saved successfully!', 'success');
    
    // Navigate back to instructor dashboard after a delay
    setTimeout(() => {
      navigate('/instructor');
    }, 2000);
  };
  
  // Open AI generation dialog
  const handleOpenAIDialog = () => {
    setOpenAIDialog(true);
  };
  
  // Generate questions using OpenAI
  const handleGenerateQuestions = async () => {
    if (selectedCourse === '') {
      showAlert('Please select a course first', 'error');
      return;
    }
    
    setIsGenerating(true);
    setOpenAIDialog(false);
    
    try {
      const courseTitle = courseData.find(c => c.id === selectedCourse)?.title || selectedCourse;
      const generatedQuestions = await generateQuestionsWithAI(
        courseTitle,
        numQuestionsToGenerate,
        difficulty
      );
      
      // Add generated questions to the list
      setQuestions([...questions, ...generatedQuestions]);
      showAlert(`Successfully generated ${generatedQuestions.length} questions!`, 'success');
    } catch (error) {
      console.error('Error generating questions:', error);
      showAlert('Failed to generate questions. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Show alert message
  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/instructor')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Create New Quiz
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quiz Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Quiz Title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Course</InputLabel>
              <Select
                value={selectedCourse}
                label="Course"
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courseData.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Time Limit (minutes)"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Passing Score (%)"
              value={passingScore}
              onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Questions ({questions.length})
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AutoAwesomeIcon />}
          onClick={handleOpenAIDialog}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </Button>
      </Box>
      
      {/* AI Generation Status */}
      {isGenerating && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography>
            Generating questions using AI... This may take a moment.
          </Typography>
        </Box>
      )}
      
      {/* Questions List */}
      <Paper sx={{ mb: 4 }}>
        {questions.length > 0 ? (
          <List>
            {questions.map((q, index) => (
              <React.Fragment key={q.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" onClick={() => handleEditQuestion(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDeleteQuestion(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {index + 1}. {q.question}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        {q.options.map((opt, optIndex) => (
                          <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
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
                        
                        {/* Display difficulty if present (for AI-generated questions) */}
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
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No questions added yet. Add questions manually or generate them with AI.
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Add/Edit Question Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingIndex >= 0 ? 'Edit Question' : 'Add New Question'}
        </Typography>
        
        <TextField
          fullWidth
          label="Question Text"
          multiline
          rows={2}
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          sx={{ mb: 3 }}
        />
        
        <Typography variant="subtitle1" gutterBottom>
          Options (select one correct answer)
        </Typography>
        
        {options.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Radio
              checked={option.isCorrect}
              onChange={() => handleOptionCorrectChange(index)}
              value={index}
              name="radio-buttons"
              color="primary"
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
      
      {/* AI Dialog */}
      <Dialog
        open={openAIDialog}
        onClose={() => setOpenAIDialog(false)}
      >
        <DialogTitle>Generate Questions with AI</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Use AI to automatically generate quiz questions based on your course content.
            Select the number of questions and difficulty level.
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Number of questions</InputLabel>
            <Select
              value={numQuestionsToGenerate}
              label="Number of questions"
              onChange={(e) => setNumQuestionsToGenerate(e.target.value)}
            >
              {[3, 5, 10, 15, 20].map((num) => (
                <MenuItem key={num} value={num}>{num}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Difficulty level</InputLabel>
            <Select
              value={difficulty}
              label="Difficulty level"
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAIDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleGenerateQuestions}
            startIcon={<AutoAwesomeIcon />}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alert Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateQuiz;
