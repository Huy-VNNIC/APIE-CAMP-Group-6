import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid, TextField,
  Button, MenuItem, FormControl, InputLabel, Select,
  Chip, FormHelperText, CircularProgress, Alert,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createCampaign, getCampaignById, updateCampaign } from '../../services/marketingService';

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Campaign' : 'Create New Campaign'}
      </Typography>
      
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
    </Container>
  );
};

export default CampaignForm;
