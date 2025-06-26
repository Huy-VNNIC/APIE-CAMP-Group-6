import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid, TextField,
  Button, MenuItem, FormControl, InputLabel, Select,
  Chip, FormHelperText, CircularProgress, Alert,
  InputAdornment, Card, CardContent, Divider, Accordion,
  AccordionSummary, AccordionDetails, Snackbar
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  AutoAwesome as AIIcon,
  Lightbulb as IdeaIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createCampaign, getCampaignById, updateCampaign } from '../../services/marketingService';
import { generateCampaignIdeas } from '../../services/aiService';

// Channel options
const channelOptions = [
  'email',
  'social',
  'website',
  'push',
  'sms'
];

// Target audience options
const audienceOptions = [
  { value: 'students', label: 'Students' },
  { value: 'instructors', label: 'Instructors' },
  { value: 'all', label: 'All Users' }
];

// Status options
const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const CampaignForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    targetAudience: 'all',
    status: 'draft',
    channels: [],
    budget: 0
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [campaignCount, setCampaignCount] = useState(0);
  
  // AI state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiPrompt, setAiPrompt] = useState('');

  // Snackbar state for better notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch campaign data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCampaign = async () => {
        try {
          setLoading(true);
          const response = await getCampaignById(id);
          const campaignData = response.data;
          
          // Convert date strings to Date objects
          setFormData({
            ...campaignData,
            startDate: campaignData.startDate ? new Date(campaignData.startDate) : null,
            endDate: campaignData.endDate ? new Date(campaignData.endDate) : null
          });
          
          setLoading(false);
        } catch (err) {
          setError('Failed to load campaign data. Please try again.');
          setLoading(false);
          console.error('Error fetching campaign:', err);
        }
      };

      fetchCampaign();
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field if exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date
    }));
    
    // Clear error for this field if exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle channels multi-select
  const handleChannelChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      channels: typeof value === 'string' ? value.split(',') : value
    }));
    
    // Clear error if exists
    if (formErrors.channels) {
      setFormErrors((prev) => ({
        ...prev,
        channels: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (formData.budget < 0) {
      errors.budget = 'Budget cannot be negative';
    }
    
    return errors;
  };

  // AI Functions
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter a description for AI campaign generation');
      return;
    }

    try {
      setAiLoading(true);
      setError(null);
      
      const response = await generateCampaignIdeas(aiPrompt);
      if (response.success && response.ideas && response.ideas.length > 0) {
        setAiSuggestions(response.ideas);
      } else {
        setError('Failed to generate AI suggestions. Please try again.');
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
      setError('AI service temporarily unavailable. Please try again later.');
    } finally {
      setAiLoading(false);
    }
  };

  const applyAISuggestion = (suggestion) => {
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + 1);

    setFormData({
      title: suggestion.title,
      description: suggestion.description,
      startDate: today,
      endDate: endDate,
      targetAudience: suggestion.targetAudience || 'all',
      status: 'draft',
      channels: suggestion.channels || ['email', 'social'],
      budget: 1000 // Default budget
    });

    // Clear AI suggestions after applying
    setAiSuggestions([]);
    setAiPrompt('');
    setSuccess('AI suggestion applied! You can now modify and submit the campaign.');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started with data:', formData);
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors);
      setFormErrors(errors);
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const payload = {
        ...formData,
        // Ensure budget is sent as a number
        budget: Number(formData.budget)
      };
      
      console.log('Sending payload to API:', payload);
      
      if (isEditMode) {
        console.log('Updating campaign with ID:', id);
        await updateCampaign(id, payload);
        setSuccess('Campaign updated successfully!');
        // Navigate back for edit mode
        setTimeout(() => {
          navigate('/marketing/campaigns');
        }, 2000);
      } else {
        console.log('Creating new campaign...');
        const result = await createCampaign(payload);
        console.log('Campaign creation result:', result);
        
        const campaignId = result.data._id;
        setCampaignCount(prev => prev + 1);
        
        const successMsg = `🎉 Campaign "${payload.title}" created successfully! Campaign ID: ${campaignId}`;
        setSuccess(successMsg);
        showNotification(successMsg, 'success');
        console.log('Campaign created:', result.data);
        
        // Reset form immediately for new campaign creation
        setFormData({
          title: '',
          description: '',
          startDate: null,
          endDate: null,
          targetAudience: 'all',
          status: 'draft',
          channels: [],
          budget: 0
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
      }
      
    } catch (err) {
      console.error('Error saving campaign:', err);
      
      // More detailed error handling
      let errorMessage = isEditMode ? 'Failed to update campaign. Please try again.' : 'Failed to create campaign. Please try again.';
      
      if (err.response) {
        // Server responded with error status
        console.error('Server error response:', err.response.data);
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors) {
          errorMessage = err.response.data.errors.map(e => e.msg).join(', ');
        }
        
        // Add specific error messages for common issues
        if (err.response.status === 400) {
          errorMessage = 'Please check your form data. Some fields may be invalid.';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again in a few moments.';
        }
      } else if (err.message) {
        // Network or other error
        if (err.message.includes('Network Error')) {
          errorMessage = 'Network connection error. Please check your internet connection and try again.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        }
        errorMessage += ` (${err.message})`;
      }
      
      setError(errorMessage);
      
      // Auto-clear error after 10 seconds
      setTimeout(() => {
        setError(null);
      }, 10000);
    } finally {
      setSubmitting(false);
    }
  };

  // Snackbar notification helper
  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (success) {
      setSnackbarMessage(success);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Campaign' : 'Create New Campaign'}
        </Typography>
        
        {!isEditMode && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {campaignCount > 0 && (
              <Chip 
                label={`${campaignCount} campaign${campaignCount > 1 ? 's' : ''} created`} 
                color="success" 
                size="small"
              />
            )}
            <Button 
              variant="outlined" 
              color="primary"
              component={Link}
              to="/marketing/campaigns"
            >
              View All Campaigns
            </Button>
          </Box>
        )}
      </Box>
      
      {/* AI Assistant Panel */}
      {!isEditMode && (
        <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AIIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="primary">
                AI Campaign Assistant
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Describe your campaign goals and let AI generate campaign ideas for you!
            </Typography>
            
            {/* Quick AI Prompts */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Quick Ideas:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                  'Promote coding bootcamp for beginners',
                  'Advanced JavaScript masterclass',
                  'Web development certification program',
                  'Mobile app development course',
                  'Data science and AI courses'
                ].map((prompt) => (
                  <Chip
                    key={prompt}
                    label={prompt}
                    size="small"
                    variant="outlined"
                    clickable
                    onClick={() => setAiPrompt(prompt)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="e.g., 'Create a campaign to promote coding courses for beginners...'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                multiline
                rows={2}
                disabled={aiLoading}
              />
              <Button
                variant="contained"
                onClick={handleAIGenerate}
                disabled={aiLoading || !aiPrompt.trim()}
                startIcon={aiLoading ? <CircularProgress size={20} /> : <IdeaIcon />}
                sx={{ minWidth: 120 }}
              >
                {aiLoading ? 'Generating...' : 'Generate'}
              </Button>
            </Box>
            
            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  AI Generated Campaign Ideas:
                </Typography>
                
                {aiSuggestions.map((suggestion, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {suggestion.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {suggestion.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip label={`Target: ${suggestion.targetAudience}`} size="small" />
                        {suggestion.channels?.map((channel) => (
                          <Chip key={channel} label={channel} size="small" variant="outlined" />
                        ))}
                      </Box>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => applyAISuggestion(suggestion)}
                      >
                        Use This Idea
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Show error/success messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Campaign Title"
                fullWidth
                required
                value={formData.title}
                onChange={handleChange}
                error={Boolean(formErrors.title)}
                helperText={formErrors.title}
              />
            </Grid>
            
            {/* Description */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Campaign Description"
                fullWidth
                required
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                error={Boolean(formErrors.description)}
                helperText={formErrors.description}
              />
            </Grid>
            
            {/* Date pickers */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(date) => handleDateChange('startDate', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={Boolean(formErrors.startDate)}
                      helperText={formErrors.startDate}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={Boolean(formErrors.endDate)}
                      helperText={formErrors.endDate}
                    />
                  )}
                  minDate={formData.startDate}
                />
              </LocalizationProvider>
            </Grid>
            
            {/* Target audience */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="target-audience-label">Target Audience</InputLabel>
                <Select
                  labelId="target-audience-label"
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  label="Target Audience"
                >
                  {audienceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Channels */}
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(formErrors.channels)}>
                <InputLabel id="channels-label">Channels</InputLabel>
                <Select
                  labelId="channels-label"
                  id="channels"
                  name="channels"
                  multiple
                  value={formData.channels}
                  onChange={handleChannelChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {channelOptions.map((channel) => (
                    <MenuItem key={channel} value={channel}>
                      {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.channels && (
                  <FormHelperText>{formErrors.channels}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Budget */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="budget"
                label="Budget"
                type="number"
                fullWidth
                value={formData.budget}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                error={Boolean(formErrors.budget)}
                helperText={formErrors.budget}
              />
            </Grid>
            
            {/* Submit button */}
            <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                sx={{ mr: 2 }} 
                onClick={() => navigate('/marketing/campaigns')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : isEditMode ? 'Update Campaign' : 'Create Campaign'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <Button color="inherit" onClick={handleSnackbarClose} size="small">
            Close
          </Button>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Container>
  );
};

export default CampaignForm;
