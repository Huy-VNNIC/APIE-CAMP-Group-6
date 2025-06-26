import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, IconButton, TextField, InputAdornment,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Card, CardContent, Grid, Fab, Menu, MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Article as ArticleIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
  AutoAwesome as AIIcon
} from '@mui/icons-material';
import { getAllPromotionalContent, deletePromotionalContent } from '../../services/marketingService';

const ContentManagement = () => {
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  // Mock data for demonstration
  const mockContent = [
    {
      _id: '1',
      title: 'Learn Web Development - Hero Banner',
      contentType: 'banner',
      description: 'Eye-catching banner for web development courses',
      status: 'active',
      campaign: { title: 'Learn Web Development - From Zero to Hero' },
      createdAt: '2025-06-26T10:00:00.000Z',
      metrics: { views: 15420, clicks: 892, ctr: 5.8 }
    },
    {
      _id: '2',
      title: 'JavaScript Bootcamp Email Template',
      contentType: 'email',
      description: 'Professional email template for JavaScript course promotion',
      status: 'active',
      campaign: { title: 'Advanced JavaScript Masterclass' },
      createdAt: '2025-06-25T14:30:00.000Z',
      metrics: { views: 8750, clicks: 425, ctr: 4.9 }
    },
    {
      _id: '3',
      title: 'Mobile App Development Video Ad',
      contentType: 'video',
      description: 'Short promotional video for mobile development course',
      status: 'draft',
      campaign: { title: 'Mobile App Development Course' },
      createdAt: '2025-06-24T16:45:00.000Z',
      metrics: { views: 0, clicks: 0, ctr: 0 }
    },
    {
      _id: '4',
      title: 'Social Media Post - Coding Tips',
      contentType: 'social',
      description: 'Engaging social media content with coding tips',
      status: 'active',
      campaign: { title: 'Internet Programming Promotion' },
      createdAt: '2025-06-23T09:15:00.000Z',
      metrics: { views: 12340, clicks: 678, ctr: 5.5 }
    }
  ];

  // Fetch content on component mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        // Try to fetch from API, fall back to mock data
        try {
          const response = await getAllPromotionalContent();
          setContent(response.data || []);
          setFilteredContent(response.data || []);
        } catch (apiError) {
          console.log('API not available, using mock data');
          setContent(mockContent);
          setFilteredContent(mockContent);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load content. Please try again.');
        setLoading(false);
        console.error('Error fetching content:', err);
      }
    };

    fetchContent();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContent(content);
    } else {
      const filtered = content.filter(
        item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.contentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContent(filtered);
    }
  }, [searchTerm, content]);

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'video': return <VideoIcon />;
      case 'banner': 
      case 'social': return <ImageIcon />;
      default: return <ArticleIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const handleMenuClick = (event, content) => {
    setAnchorEl(event.currentTarget);
    setSelectedContent(content);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContent(null);
  };

  const handleDeleteClick = (content) => {
    setContentToDelete(content);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!contentToDelete) return;

    try {
      await deletePromotionalContent(contentToDelete._id);
      setContent(content.filter(item => item._id !== contentToDelete._id));
      setDeleteDialogOpen(false);
      setContentToDelete(null);
    } catch (err) {
      setError('Failed to delete content. Please try again.');
      console.error('Error deleting content:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading content...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Content Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<AIIcon />}
            sx={{ mr: 2 }}
            onClick={() => alert('AI Content Generator coming soon!')}
          >
            AI Generate
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/marketing/content/new"
          >
            Create Content
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search content by title, type, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {filteredContent.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getContentTypeIcon(item.contentType)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, item)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={item.contentType}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={item.status}
                    size="small"
                    color={getStatusColor(item.status)}
                  />
                </Box>

                {item.campaign && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Campaign: {item.campaign.title}
                  </Typography>
                )}

                {/* Metrics */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span>Views: {item.metrics?.views || 0}</span>
                  <span>Clicks: {item.metrics?.clicks || 0}</span>
                  <span>CTR: {item.metrics?.ctr || 0}%</span>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredContent.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No content found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first promotional content to get started'}
          </Typography>
        </Paper>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          alert(`Edit ${selectedContent?.title}`);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedContent)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Content</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{contentToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContentManagement;
