import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { LiveSessionContext } from '../contexts/LiveSessionContext';

const CreateSessionDialog = ({ open, onClose, courses }) => {
  const { createSession, isConnecting } = useContext(LiveSessionContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.courseId) {
      newErrors.courseId = 'Please select a course';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      await createSession(formData);
      // The context will handle navigation on success
    } catch (error) {
      console.error('Error creating session:', error);
      // Show error to user
    }
  };

  return (
    <Dialog open={open} onClose={isConnecting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Start a New Live Session</DialogTitle>
      
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Session Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          disabled={isConnecting}
          required
        />
        
        <FormControl fullWidth margin="normal" error={!!errors.courseId} disabled={isConnecting} required>
          <InputLabel>Course</InputLabel>
          <Select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            label="Course"
          >
            {courses.map(course => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
          {errors.courseId && <FormHelperText>{errors.courseId}</FormHelperText>}
        </FormControl>
        
        <TextField
          fullWidth
          margin="normal"
          label="Description (optional)"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          disabled={isConnecting}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={isConnecting}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={isConnecting}
          startIcon={isConnecting ? <CircularProgress size={20} /> : null}
        >
          {isConnecting ? 'Starting...' : 'Start Session'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSessionDialog;
