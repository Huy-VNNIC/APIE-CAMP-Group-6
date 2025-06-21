import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid, TextField,
  Button, MenuItem, FormControl, InputLabel, Select,
  Chip, FormHelperText, CircularProgress, Alert,
  InputAdornment, Accordion, AccordionSummary, AccordionDetails, 
  Card, CardContent, Divider, List, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Tab, Tabs
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { 
  ExpandMore as ExpandMoreIcon,
  SmartToy as AIIcon,
  AutoGraph as AnalyticsIcon,
  ContentPaste as ContentIcon,
  Close as CloseIcon,
  Lightbulb as IdeaIcon
} from '@mui/icons-material';
import { createCampaign, getCampaignById, updateCampaign } from '../../services/marketingService';
import { 
  generateCampaignIdeas, 
  generateContentSuggestions,
  analyzeTargetAudience,
  optimizeCampaign 
} from '../../services/aiService';

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

const AIEnhancedCampaignForm = () => {
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

  // AI state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiIdeas, setAiIdeas] = useState([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [aiDialogTab, setAiDialogTab] = useState(0);
  const [audienceInsights, setAudienceInsights] = useState(null);
  const [contentSuggestions, setContentSuggestions] = useState(null);

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
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
      
      if (isEditMode) {
        await updateCampaign(id, payload);
        setSuccess('Campaign updated successfully!');
      } else {
        await createCampaign(payload);
        setSuccess('Campaign created successfully!');
        
        // Reset form after successful creation
        if (!isEditMode) {
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
        }
      }
      
      // Navigate back to campaigns list after short delay
      setTimeout(() => {
        navigate('/marketing/campaigns');
      }, 1500);
      
    } catch (err) {
      setError(isEditMode ? 'Failed to update campaign. Please try again.' : 'Failed to create campaign. Please try again.');
      console.error('Error saving campaign:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle AI campaign idea generation
  const handleGenerateCampaignIdeas = async () => {
    if (!aiPrompt.trim()) {
      return;
    }
    
    try {
      setAiGenerating(true);
      setError(null);
      
      const response = await generateCampaignIdeas(aiPrompt);
      setAiIdeas(response.data || []);
      
      setAiGenerating(false);
      setShowAiDialog(true);
    } catch (err) {
      setError('Failed to generate campaign ideas. Please try again.');
      setAiGenerating(false);
      console.error('Error generating AI campaign ideas:', err);
    }
  };

  // Apply an AI idea to the form
  const applyAiIdea = (idea) => {
    setFormData((prev) => ({
      ...prev,
      title: idea.title || prev.title,
      description: idea.description || prev.description,
      targetAudience: idea.targetAudience || prev.targetAudience,
      channels: idea.channels || prev.channels
    }));
    
    setShowAiDialog(false);
  };

  // Generate audience insights
  const generateAudienceInsights = async () => {
    try {
      setAiGenerating(true);
      setError(null);
      
      const response = await analyzeTargetAudience({
        targetAudience: formData.targetAudience
      });
      
      setAudienceInsights(response.data);
      setAiDialogTab(1);
      setShowAiDialog(true);
      setAiGenerating(false);
    } catch (err) {
      setError('Failed to generate audience insights. Please try again.');
      setAiGenerating(false);
      console.error('Error generating AI audience insights:', err);
    }
  };

  // Generate content suggestions
  const generateAiContentSuggestions = async () => {
    try {
      setAiGenerating(true);
      setError(null);
      
      const response = await generateContentSuggestions(formData);
      
      setContentSuggestions(response.data);
      setAiDialogTab(2);
      setShowAiDialog(true);
      setAiGenerating(false);
    } catch (err) {
      setError('Failed to generate content suggestions. Please try again.');
      setAiGenerating(false);
      console.error('Error generating AI content suggestions:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Campaign' : 'Create New Campaign'}
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<AIIcon />}
          onClick={() => setShowAiDialog(true)}
        >
          AI Assistant
        </Button>
      </Box>
      
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

      {/* AI Assistant Dialog */}
      <Dialog 
        open={showAiDialog} 
        onClose={() => setShowAiDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <AIIcon sx={{ mr: 1 }} /> AI Campaign Assistant
            </Typography>
            <IconButton edge="end" color="inherit" onClick={() => setShowAiDialog(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Tabs 
            value={aiDialogTab} 
            onChange={(_, newValue) => setAiDialogTab(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab icon={<IdeaIcon />} label="Campaign Ideas" />
            <Tab icon={<AnalyticsIcon />} label="Audience Insights" />
            <Tab icon={<ContentIcon />} label="Content Suggestions" />
          </Tabs>

          {aiDialogTab === 0 && (
            <>
              <TextField
                label="What kind of campaign would you like to create?"
                placeholder="E.g., A summer promotion for our programming courses targeting college students"
                fullWidth
                multiline
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateCampaignIdeas}
                  disabled={aiGenerating || !aiPrompt.trim()}
                >
                  {aiGenerating ? <CircularProgress size={24} /> : 'Generate Campaign Ideas'}
                </Button>
              </Box>

              {aiIdeas.length > 0 && (
                <Grid container spacing={2}>
                  {aiIdeas.map((idea, index) => (
                    <Grid item xs={12} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {idea.title}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {idea.description}
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Target Audience: {idea.audienceDescription}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Recommended Channels: {idea.channels.join(', ')}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right', mt: 1 }}>
                            <Button 
                              size="small" 
                              variant="contained" 
                              onClick={() => applyAiIdea(idea)}
                            >
                              Use This Idea
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}

          {aiDialogTab === 1 && (
            <>
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  onClick={generateAudienceInsights}
                  disabled={aiGenerating || !formData.targetAudience}
                >
                  {aiGenerating ? <CircularProgress size={24} /> : 'Generate Audience Insights'}
                </Button>
              </Box>

              {audienceInsights && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {audienceInsights.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {audienceInsights.summary}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Key Characteristics
                    </Typography>
                    <List dense>
                      {audienceInsights.characteristics.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                      Messaging Recommendations
                    </Typography>
                    <Typography variant="body2">
                      {audienceInsights.messagingRecommendations}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {aiDialogTab === 2 && (
            <>
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  onClick={generateAiContentSuggestions}
                  disabled={aiGenerating || !formData.title}
                >
                  {aiGenerating ? <CircularProgress size={24} /> : 'Generate Content Ideas'}
                </Button>
              </Box>

              {contentSuggestions && (
                <div>
                  {contentSuggestions.channelContent.map((channel, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">
                          {channel.channelName} Campaign Content
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" paragraph>
                          {channel.description}
                        </Typography>
                        
                        {channel.contentIdeas.map((idea, i) => (
                          <Box key={i} sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">
                              {idea.title}
                            </Typography>
                            <Typography variant="body2">
                              {idea.content}
                            </Typography>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAiDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Main Form */}
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* AI Quick Prompt */}
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AIIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>Quick AI Campaign Generator</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Describe your campaign goals"
                        placeholder="E.g., A summer promotion for our programming courses targeting college students"
                        fullWidth
                        multiline
                        rows={2}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                      <Button
                        variant="contained"
                        onClick={handleGenerateCampaignIdeas}
                        disabled={aiGenerating || !aiPrompt.trim()}
                        startIcon={aiGenerating ? <CircularProgress size={16} /> : <AIIcon />}
                      >
                        Generate Campaign Ideas
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  size="small"
                  onClick={generateAudienceInsights}
                  startIcon={<AIIcon />}
                >
                  AI Audience Insights
                </Button>
              </Box>
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  size="small"
                  onClick={generateAiContentSuggestions}
                  startIcon={<AIIcon />}
                >
                  AI Content Suggestions
                </Button>
              </Box>
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
    </Container>
  );
};

export default AIEnhancedCampaignForm;
