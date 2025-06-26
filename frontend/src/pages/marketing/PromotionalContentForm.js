import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button, 
  MenuItem, FormControl, InputLabel, Select, CircularProgress, 
  Alert, Card, CardContent, CardMedia, IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  Preview as PreviewIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { 
  createPromotionalContent, 
  updatePromotionalContent, 
  getPromotionalContentById,
  getAllCampaigns 
} from '../../services/marketingService';

const contentTypes = [
  { value: 'banner', label: 'Banner Advertisement' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'social', label: 'Social Media Post' },
  { value: 'blog', label: 'Blog Post' },
  { value: 'video', label: 'Video Content' },
  { value: 'newsletter', label: 'Newsletter' }
];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
];

const PromotionalContentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'banner',
    description: '',
    content: '',
    imageUrl: '',
    linkUrl: '',
    status: 'draft',
    campaign: ''
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    if (isEditMode) {
      fetchContent();
    }
  }, [id, isEditMode]);

  const fetchCampaigns = async () => {
    try {
      const response = await getAllCampaigns();
      setCampaigns(response.data || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await getPromotionalContentById(id);
      setFormData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching promotional content:', err);
      setError('Failed to load promotional content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      if (isEditMode) {
        await updatePromotionalContent(id, formData);
        setSuccess('Promotional content updated successfully!');
        setTimeout(() => navigate('/marketing/promotional-content'), 2000);
      } else {
        const result = await createPromotionalContent(formData);
        setSuccess(`Promotional content "${formData.title}" created successfully!`);
        
        // Reset form for new content creation
        setFormData({
          title: '',
          contentType: 'banner',
          description: '',
          content: '',
          imageUrl: '',
          linkUrl: '',
          status: 'draft',
          campaign: ''
        });
      }
      
    } catch (err) {
      console.error('Error saving promotional content:', err);
      setError(isEditMode 
        ? 'Failed to update promotional content. Please try again.' 
        : 'Failed to create promotional content. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real application, you would upload this to a file server
      // For now, we'll create a placeholder URL
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: imageUrl
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  const renderContentPreview = () => {
    switch (formData.contentType) {
      case 'banner':
        return (
          <Card sx={{ maxWidth: 400, mx: 'auto' }}>
            {formData.imageUrl && (
              <CardMedia
                component="img"
                height="200"
                image={formData.imageUrl}
                alt={formData.title}
              />
            )}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {formData.title || 'Banner Title'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.description || 'Banner description...'}
              </Typography>
              {formData.linkUrl && (
                <Button variant="contained" sx={{ mt: 2 }} fullWidth>
                  Learn More
                </Button>
              )}
            </CardContent>
          </Card>
        );
      
      case 'email':
        return (
          <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
              {formData.title || 'Email Subject'}
            </Typography>
            <Typography variant="body1" paragraph>
              {formData.content || 'Email content goes here...'}
            </Typography>
            {formData.imageUrl && (
              <img 
                src={formData.imageUrl} 
                alt="Email header" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
              />
            )}
          </Paper>
        );
      
      case 'social':
        return (
          <Paper sx={{ p: 2, maxWidth: 350, mx: 'auto', border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle1" gutterBottom>
              {formData.title || 'Social Media Post'}
            </Typography>
            <Typography variant="body2" paragraph>
              {formData.content || 'Social media content...'}
            </Typography>
            {formData.imageUrl && (
              <img 
                src={formData.imageUrl} 
                alt="Social media" 
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
          </Paper>
        );
      
      default:
        return (
          <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              {formData.title || 'Content Title'}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {formData.description || 'Content description...'}
            </Typography>
            <Typography variant="body1">
              {formData.content || 'Content body...'}
            </Typography>
          </Paper>
        );
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading promotional content...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Promotional Content' : 'Create Promotional Content'}
        </Typography>
        <Box>
          <Button
            onClick={() => setPreviewMode(!previewMode)}
            startIcon={<PreviewIcon />}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            onClick={() => navigate('/marketing/promotional-content')}
            startIcon={<CancelIcon />}
            variant="outlined"
          >
            Cancel
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {previewMode ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom textAlign="center">
            Content Preview
          </Typography>
          {renderContentPreview()}
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <TextField
                  name="title"
                  label="Content Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Content Type</InputLabel>
                  <Select
                    name="contentType"
                    value={formData.contentType}
                    onChange={handleChange}
                    label="Content Type"
                  >
                    {contentTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  required
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  helperText="Brief description of the content"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="content"
                  label="Content Body"
                  fullWidth
                  required
                  multiline
                  rows={6}
                  value={formData.content}
                  onChange={handleChange}
                  helperText="Main content text"
                />
              </Grid>

              {/* Media & Links */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Media & Links
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ border: '2px dashed #ccc', p: 3, textAlign: 'center', borderRadius: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload">
                    <IconButton component="span" color="primary">
                      <UploadIcon fontSize="large" />
                    </IconButton>
                  </label>
                  <Typography variant="body2" color="text.secondary">
                    Click to upload image
                  </Typography>
                  
                  {formData.imageUrl && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                      />
                      <Box sx={{ mt: 1 }}>
                        <IconButton onClick={removeImage} color="error" size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="linkUrl"
                  label="Link URL"
                  fullWidth
                  value={formData.linkUrl}
                  onChange={handleChange}
                  helperText="Optional link for call-to-action"
                />
                
                <TextField
                  name="imageUrl"
                  label="Image URL (Alternative)"
                  fullWidth
                  value={formData.imageUrl}
                  onChange={handleChange}
                  helperText="Or paste image URL directly"
                  sx={{ mt: 2 }}
                />
              </Grid>

              {/* Settings */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Settings
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Associated Campaign</InputLabel>
                  <Select
                    name="campaign"
                    value={formData.campaign}
                    onChange={handleChange}
                    label="Associated Campaign"
                  >
                    <MenuItem value="">
                      <em>No Campaign</em>
                    </MenuItem>
                    {campaigns.map(campaign => (
                      <MenuItem key={campaign._id} value={campaign._id}>
                        {campaign.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    {statusOptions.map(status => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button
                    onClick={() => navigate('/marketing/promotional-content')}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={submitting}
                  >
                    {submitting 
                      ? 'Saving...' 
                      : isEditMode 
                        ? 'Update Content' 
                        : 'Create Content'
                    }
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default PromotionalContentForm;
