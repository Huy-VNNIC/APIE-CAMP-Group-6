import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid, Button, Chip, Card, CardContent,
  CardMedia, CircularProgress, Alert, IconButton, Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  Launch as LaunchIcon,
  Share as ShareIcon,
  Visibility as ViewsIcon,
  TouchApp as ClicksIcon,
  TrendingUp as ConversionsIcon
} from '@mui/icons-material';
import { getPromotionalContentById, deletePromotionalContent } from '../../services/marketingService';

const contentTypeColors = {
  banner: 'primary',
  email: 'success',
  social: 'info',
  blog: 'warning',
  video: 'error',
  newsletter: 'secondary'
};

const statusColors = {
  draft: 'default',
  published: 'success',
  archived: 'error'
};

const PromotionalContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [id]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await getPromotionalContentById(id);
      setContent(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching promotional content:', err);
      setError('Failed to load promotional content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this promotional content?')) {
      try {
        await deletePromotionalContent(id);
        navigate('/marketing/promotional-content');
      } catch (err) {
        console.error('Error deleting promotional content:', err);
        setError('Failed to delete promotional content. Please try again.');
      }
    }
  };

  const renderContentDisplay = () => {
    if (!content) return null;

    switch (content.contentType) {
      case 'banner':
        return (
          <Card sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            {content.imageUrl && (
              <CardMedia
                component="img"
                height="300"
                image={content.imageUrl}
                alt={content.title}
              />
            )}
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {content.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {content.description}
              </Typography>
              <Typography variant="body2" paragraph>
                {content.content}
              </Typography>
              {content.linkUrl && (
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<LaunchIcon />}
                  href={content.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                </Button>
              )}
            </CardContent>
          </Card>
        );
      
      case 'email':
        return (
          <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto', mb: 3, backgroundColor: '#f9f9f9' }}>
            <Typography variant="overline" color="text.secondary">
              EMAIL PREVIEW
            </Typography>
            <Typography variant="h4" gutterBottom sx={{ mt: 1 }}>
              {content.title}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {content.imageUrl && (
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <img 
                  src={content.imageUrl} 
                  alt="Email header" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '300px', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              {content.content}
            </Typography>
            {content.linkUrl && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<LaunchIcon />}
                  href={content.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Details
                </Button>
              </Box>
            )}
          </Paper>
        );
      
      case 'social':
        return (
          <Paper sx={{ 
            p: 3, 
            maxWidth: 450, 
            mx: 'auto', 
            mb: 3, 
            border: '1px solid #e0e0e0',
            borderRadius: 3,
            boxShadow: 3
          }}>
            <Typography variant="overline" color="text.secondary">
              SOCIAL MEDIA POST
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 1, fontWeight: 'bold' }}>
              {content.title}
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
              {content.content}
            </Typography>
            {content.imageUrl && (
              <Box sx={{ mb: 2 }}>
                <img 
                  src={content.imageUrl} 
                  alt="Social media" 
                  style={{ 
                    width: '100%', 
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
            )}
            {content.linkUrl && (
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<LaunchIcon />}
                href={content.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1 }}
              >
                Read More
              </Button>
            )}
          </Paper>
        );
      
      case 'blog':
        return (
          <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', mb: 3 }}>
            <Typography variant="overline" color="text.secondary">
              BLOG POST
            </Typography>
            <Typography variant="h3" gutterBottom sx={{ mt: 1, fontWeight: 'bold' }}>
              {content.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              {content.description}
            </Typography>
            <Divider sx={{ my: 3 }} />
            {content.imageUrl && (
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <img 
                  src={content.imageUrl} 
                  alt="Blog header" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '400px', 
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />
              </Box>
            )}
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
              {content.content}
            </Typography>
          </Paper>
        );
      
      default:
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {content.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {content.description}
            </Typography>
            {content.imageUrl && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img 
                  src={content.imageUrl} 
                  alt={content.title} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}
            <Typography variant="body1" paragraph>
              {content.content}
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

  if (error || !content) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          {error || 'Promotional content not found.'}
        </Alert>
        <Button
          component={Link}
          to="/marketing/promotional-content"
          startIcon={<BackIcon />}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            component={Link}
            to="/marketing/promotional-content"
            color="primary"
          >
            <BackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Promotional Content Details
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            to={`/marketing/promotional-content/${id}/edit`}
            startIcon={<EditIcon />}
            variant="outlined"
            color="primary"
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Content Display */}
        <Grid item xs={12} md={8}>
          {renderContentDisplay()}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Meta Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Content Information
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Type
              </Typography>
              <Chip
                label={content.contentType.toUpperCase()}
                color={contentTypeColors[content.contentType]}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={content.status.toUpperCase()}
                color={statusColors[content.status]}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body1">
                {new Date(content.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body1">
                {new Date(content.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>

            {content.linkUrl && (
              <Box sx={{ mt: 3 }}>
                <Button
                  href={content.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LaunchIcon />}
                  variant="outlined"
                  fullWidth
                >
                  Visit Link
                </Button>
              </Box>
            )}
          </Paper>

          {/* Performance Metrics */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <ViewsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">
                    {content.metrics?.views || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Views
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <ClicksIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">
                    {content.metrics?.clicks || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clicks
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <ShareIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">
                    {content.metrics?.shares || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Shares
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <ConversionsIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">
                    {content.metrics?.conversions || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversions
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Click-through rate calculation */}
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Click-through Rate (CTR)
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {content.metrics?.views > 0 
                  ? ((content.metrics.clicks / content.metrics.views) * 100).toFixed(2)
                  : 0
                }%
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PromotionalContentDetail;
