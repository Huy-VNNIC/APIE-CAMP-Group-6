// File content from above - QuizGenerator.jsx
// src/components/QuizGenerator.jsx
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { generateQuizQuestions } from '../services/openaiService';

const QuizGenerator = ({ open, onClose, onQuestionsGenerated, courseTitle }) => {
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      const questions = await generateQuizQuestions(
        courseTitle,
        numQuestions,
        difficulty.toLowerCase()
      );
      
      onQuestionsGenerated(questions);
      onClose();
    } catch (error) {
      console.error('Error generating questions:', error);
      // You might want to show an error message here
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={isGenerating ? undefined : onClose} // Prevent closing while generating
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Generate Questions with AI</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Use AI to automatically generate quiz questions based on your course content. 
          Select the number of questions and difficulty level.
        </DialogContentText>
        
        <Box sx={{ mt: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="num-questions-label">Number of questions</InputLabel>
            <Select
              labelId="num-questions-label"
              value={numQuestions}
              label="Number of questions"
              onChange={(e) => setNumQuestions(e.target.value)}
              disabled={isGenerating}
            >
              {[3, 5, 10, 15, 20].map(num => (
                <MenuItem key={num} value={num}>{num}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel id="difficulty-level-label">Difficulty level</InputLabel>
            <Select
              labelId="difficulty-level-label"
              value={difficulty}
              label="Difficulty level"
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={isGenerating}
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isGenerating}>
          Cancel
        </Button>
        <Button 
          onClick={handleGenerate} 
          variant="contained" 
          color="primary"
          startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizGenerator;