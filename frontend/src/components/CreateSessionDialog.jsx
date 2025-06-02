import React, { useState } from 'react';
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
  FormControlLabel,
  Checkbox,
  Stack,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CreateSessionDialog = ({ open, onClose, onSessionCreated, courses = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    usePassword: false,
    password: '',
    description: '',
    customId: false,
    sessionId: ''
  });
  
  const [localError, setLocalError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!formData.title) {
      setLocalError('Session title is required');
      return;
    }
    
    if (!formData.courseId) {
      setLocalError('Please select a course');
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newSession = {
        id: formData.customId && formData.sessionId ? 
          formData.sessionId : 
          `session-${Date.now().toString(36)}`,
        title: formData.title,
        courseId: formData.courseId,
        description: formData.description,
        password: formData.usePassword ? formData.password : null,
        hasPassword: formData.usePassword && !!formData.password,
        participantCount: 1,
        startTime: new Date().toISOString()
      };
      
      if (onSessionCreated) {
        onSessionCreated(newSession);
      } else {
        handleClose();
      }
    } catch (err) {
      setLocalError('Error creating session');
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleClose = () => {
    // Reset form
    setFormData({
      title: '',
      courseId: '',
      usePassword: false,
      password: '',
      description: '',
      customId: false,
      sessionId: ''
    });
    setLocalError('');
    setExpanded(false);
    onClose();
  };
  
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      password,
      usePassword: true
    });
  };
  
  const generateSessionId = () => {
    setFormData({
      ...formData,
      sessionId: `session-${Date.now().toString(36)}`,
      customId: true
    });
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Start a New Live Session</DialogTitle>
      
      <DialogContent>
        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            name="title"
            label="Session Title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={handleChange}
            required
            autoFocus
          />
          
          <FormControl fullWidth margin="normal" required>
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
          </FormControl>
          
          <TextField
            name="description"
            label="Description (optional)"
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
          />
          
          <Accordion 
            expanded={expanded} 
            onChange={() => setExpanded(!expanded)}
            sx={{ mt: 2, mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Advanced Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    name="usePassword"
                    checked={formData.usePassword}
                    onChange={handleChange}
                  />
                }
                label="Password Protected"
              />
              
              {formData.usePassword && (
                <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 2 }}>
                  <TextField
                    name="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                  />
                  <Button 
                    variant="outlined" 
                    onClick={generatePassword}
                    size="small"
                  >
                    Generate
                  </Button>
                </Stack>
              )}
              
              <FormControlLabel
                control={
                  <Checkbox
                    name="customId"
                    checked={formData.customId}
                    onChange={handleChange}
                  />
                }
                label="Custom Session ID"
              />
              
              {formData.customId && (
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <TextField
                    name="sessionId"
                    label="Session ID"
                    value={formData.sessionId}
                    onChange={handleChange}
                    fullWidth
                    helperText="A unique identifier for this session"
                  />
                  <Button 
                    variant="outlined" 
                    onClick={generateSessionId}
                    size="small"
                  >
                    Generate
                  </Button>
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>
        </form>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Session'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSessionDialog;
