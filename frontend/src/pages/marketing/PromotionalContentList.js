import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid, Button, Card, CardContent,
  CardActions, IconButton, Chip, CircularProgress, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Image as ImageIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  Article as BlogIcon,
  VideoLibrary as VideoIcon,
  Campaign as BannerIcon,
  Newspaper as NewsletterIcon
} from '@mui/icons-material';
import { getAllPromotionalContent, deletePromotionalContent } from '../../services/marketingService';

const contentTypeIcons = {
  banner: <BannerIcon />,
  email: <EmailIcon />,
  social: <ShareIcon />,
  blog: <BlogIcon />,
  video: <VideoIcon />,
  newsletter: <NewsletterIcon />
};

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

const PromotionalContentList = () => {
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await getAllPromotionalContent();
      setContents(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching promotional content:', err);
      setError('Failed to load promotional content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedContent) return;
    
    try {
      await deletePromotionalContent(selectedContent._id);
      setContents(contents.filter(content => content._id !== selectedContent._id));
      setDeleteDialogOpen(false);
      setSelectedContent(null);
    } catch (err) {
      console.error('Error deleting promotional content:', err);
      setError('Failed to delete promotional content. Please try again.');
    }
  };

  const openDeleteDialog = (content) => {
    setSelectedContent(content);
    setDeleteDialogOpen(true);
  };

  const filteredContents = contents.filter(content => {
    const typeMatch = filterType === 'all' || content.contentType === filterType;
    const statusMatch = filterStatus === 'all' || content.status === filterStatus;
    return typeMatch && statusMatch;
  });

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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Promotional Content
        </Typography>
        <Button
          component={Link}
          to="/marketing/promotional-content/new"
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
        >
          Create Content
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Filters</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Content Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="all">All Types</option>
              <option value="banner">Banner</option>
              <option value="email">Email</option>
              <option value="social">Social Media</option>
              <option value="blog">Blog Post</option>
              <option value="video">Video</option>
              <option value="newsletter">Newsletter</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Total: {filteredContents.length} items
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Content Grid */}
      {filteredContents.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No promotional content found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {filterType !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your filters or create new content.'
              : 'Get started by creating your first promotional content.'
            }
          </Typography>
          <Button
            component={Link}
            to="/marketing/promotional-content/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create First Content
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredContents.map((content) => (
            <Grid item xs={12} sm={6} md={4} key={content._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                {/* Card Header */}
                <Box sx={{ p: 2, pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip
                      icon={contentTypeIcons[content.contentType]}
                      label={content.contentType.toUpperCase()}
                      color={contentTypeColors[content.contentType]}
                      size="small"
                    />
                    <Chip
                      label={content.status.toUpperCase()}
                      color={statusColors[content.status]}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="h6" component="h3" gutterBottom>
                    {content.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {content.description}
                  </Typography>
                </Box>

                {/* Image Preview */}
                {content.imageUrl && (
                  <Box sx={{ px: 2 }}>
                    <img
                      src={content.imageUrl}
                      alt={content.title}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </Box>
                )}

                {/* Metrics */}
                <Box sx={{ p: 2, pt: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Views: {content.metrics?.views || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Clicks: {content.metrics?.clicks || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Shares: {content.metrics?.shares || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Conversions: {content.metrics?.conversions || 0}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Card Actions */}
                <CardActions sx={{ mt: 'auto', justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <IconButton
                      component={Link}
                      to={`/marketing/promotional-content/${content._id}`}
                      color="primary"
                      title="View Details"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={`/marketing/promotional-content/${content._id}/edit`}
                      color="warning"
                      title="Edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteDialog(content)}
                      color="error"
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        component={Link}
        to="/marketing/promotional-content/new"
      >
        <AddIcon />
      </Fab>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Promotional Content</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedContent?.title}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PromotionalContentList;
