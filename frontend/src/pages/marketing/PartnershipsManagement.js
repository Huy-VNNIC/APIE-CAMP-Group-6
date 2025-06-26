import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, IconButton, TextField, InputAdornment,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Card, CardContent, Grid, Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Public as PublicIcon,
  TrendingUp as TrendingUpIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { getAllPartnerships, deletePartnership } from '../../services/marketingService';

const PartnershipsManagement = () => {
  const [partnerships, setPartnerships] = useState([]);
  const [filteredPartnerships, setFilteredPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partnershipToDelete, setPartnershipToDelete] = useState(null);

  // Mock data for demonstration
  const mockPartnerships = [
    {
      _id: '1',
      name: 'Tech University',
      type: 'educational',
      description: 'Partnership to provide coding courses for computer science students',
      status: 'active',
      contactEmail: 'partnerships@techuni.edu',
      contactPhone: '+1-555-0123',
      startDate: '2025-01-15T00:00:00.000Z',
      endDate: '2025-12-31T00:00:00.000Z',
      benefits: ['Student discounts', 'Curriculum integration', 'Internship opportunities'],
      metrics: {
        studentsReached: 2500,
        coursesCompleted: 180,
        revenue: 45000
      }
    },
    {
      _id: '2',
      name: 'StartupHub Incubator',
      type: 'corporate',
      description: 'Providing coding bootcamps for startup founders and employees',
      status: 'active',
      contactEmail: 'hello@startuphub.com',
      contactPhone: '+1-555-0456',
      startDate: '2025-03-01T00:00:00.000Z',
      endDate: '2026-02-28T00:00:00.000Z',
      benefits: ['Corporate packages', 'Custom training programs', 'Mentorship access'],
      metrics: {
        studentsReached: 850,
        coursesCompleted: 95,
        revenue: 125000
      }
    },
    {
      _id: '3',
      name: 'CodeForGood NGO',
      type: 'nonprofit',
      description: 'Free coding education for underserved communities',
      status: 'active',
      contactEmail: 'impact@codeforgood.org',
      contactPhone: '+1-555-0789',
      startDate: '2025-02-01T00:00:00.000Z',
      endDate: '2025-11-30T00:00:00.000Z',
      benefits: ['Social impact', 'Free course access', 'Community outreach'],
      metrics: {
        studentsReached: 1200,
        coursesCompleted: 75,
        revenue: 0
      }
    },
    {
      _id: '4',
      name: 'Global Tech Solutions',
      type: 'corporate',
      description: 'Employee upskilling and professional development programs',
      status: 'pending',
      contactEmail: 'hr@globaltech.com',
      contactPhone: '+1-555-0321',
      startDate: '2025-07-01T00:00:00.000Z',
      endDate: '2026-06-30T00:00:00.000Z',
      benefits: ['Volume discounts', 'Custom learning paths', 'Progress tracking'],
      metrics: {
        studentsReached: 0,
        coursesCompleted: 0,
        revenue: 0
      }
    }
  ];

  // Fetch partnerships on component mount
  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        setLoading(true);
        // Try to fetch from API, fall back to mock data
        try {
          const response = await getAllPartnerships();
          setPartnerships(response.data || []);
          setFilteredPartnerships(response.data || []);
        } catch (apiError) {
          console.log('API not available, using mock data');
          setPartnerships(mockPartnerships);
          setFilteredPartnerships(mockPartnerships);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load partnerships. Please try again.');
        setLoading(false);
        console.error('Error fetching partnerships:', err);
      }
    };

    fetchPartnerships();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPartnerships(partnerships);
    } else {
      const filtered = partnerships.filter(
        partnership =>
          partnership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partnership.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partnership.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPartnerships(filtered);
    }
  }, [searchTerm, partnerships]);

  const getPartnershipTypeIcon = (type) => {
    switch (type) {
      case 'educational': return <SchoolIcon />;
      case 'corporate': return <BusinessIcon />;
      case 'nonprofit': return <PublicIcon />;
      default: return <BusinessIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'expired': return 'error';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const handleDeleteClick = (partnership) => {
    setPartnershipToDelete(partnership);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!partnershipToDelete) return;

    try {
      await deletePartnership(partnershipToDelete._id);
      setPartnerships(partnerships.filter(p => p._id !== partnershipToDelete._id));
      setDeleteDialogOpen(false);
      setPartnershipToDelete(null);
    } catch (err) {
      setError('Failed to delete partnership. Please try again.');
      console.error('Error deleting partnership:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading partnerships...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Partnerships Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/marketing/partnerships/new"
        >
          New Partnership
        </Button>
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
          placeholder="Search partnerships by name, type, or description..."
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

      {/* Partnerships Grid */}
      <Grid container spacing={3}>
        {filteredPartnerships.map((partnership) => (
          <Grid item xs={12} md={6} lg={4} key={partnership._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {getPartnershipTypeIcon(partnership.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {partnership.name}
                      </Typography>
                      <Chip
                        label={partnership.status}
                        size="small"
                        color={getStatusColor(partnership.status)}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => alert(`Edit ${partnership.name}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(partnership)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {partnership.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={partnership.type}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                </Box>

                {/* Contact Info */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {partnership.contactEmail}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {partnership.contactPhone}
                    </Typography>
                  </Box>
                </Box>

                {/* Metrics */}
                {partnership.status === 'active' && (
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: 1, 
                    fontSize: '0.875rem',
                    backgroundColor: 'grey.50',
                    p: 1,
                    borderRadius: 1
                  }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Students</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {partnership.metrics?.studentsReached || 0}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Completed</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {partnership.metrics?.coursesCompleted || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="caption" color="text.secondary">Revenue</Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {formatCurrency(partnership.metrics?.revenue || 0)}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Benefits */}
                {partnership.benefits && partnership.benefits.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">Benefits:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {partnership.benefits.slice(0, 3).map((benefit, index) => (
                        <Chip
                          key={index}
                          label={benefit}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      ))}
                      {partnership.benefits.length > 3 && (
                        <Chip
                          label={`+${partnership.benefits.length - 3} more`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredPartnerships.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No partnerships found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first partnership to get started'}
          </Typography>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Partnership</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the partnership with "{partnershipToDelete?.name}"? This action cannot be undone.
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

export default PartnershipsManagement;
