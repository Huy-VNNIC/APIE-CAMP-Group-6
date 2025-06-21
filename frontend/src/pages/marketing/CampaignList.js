import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, Paper, Table, 
  TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Chip, IconButton, TextField, InputAdornment,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { getAllCampaigns, deleteCampaign } from '../../services/marketingService';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  // Fetch all campaigns on component mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await getAllCampaigns();
        setCampaigns(response.data || []);
        setFilteredCampaigns(response.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load campaigns. Please try again.');
        setLoading(false);
        console.error('Error fetching campaigns:', err);
      }
    };

    fetchCampaigns();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCampaigns(campaigns);
    } else {
      const filtered = campaigns.filter(
        campaign => 
          campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCampaigns(filtered);
    }
  }, [searchTerm, campaigns]);

  // Open delete confirmation dialog
  const handleDeleteClick = (campaign) => {
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setCampaignToDelete(null);
  };

  // Handle campaign deletion
  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return;
    
    try {
      await deleteCampaign(campaignToDelete._id);
      setCampaigns(campaigns.filter(c => c._id !== campaignToDelete._id));
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    } catch (err) {
      setError('Failed to delete campaign. Please try again.');
      console.error('Error deleting campaign:', err);
    }
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'draft':
        return 'info';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading campaigns...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Marketing Campaigns
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/marketing/campaigns/new"
        >
          Create Campaign
        </Button>
      </Box>

      {/* Error message */}
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Search bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search Campaigns"
          variant="outlined"
          fullWidth
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
      </Box>

      {/* Campaigns table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Title</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Target Audience</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Start Date</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">End Date</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Budget</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <TableRow key={campaign._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Link 
                      to={`/marketing/campaigns/${campaign._id}`}
                      style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                    >
                      {campaign.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={campaign.status} 
                      color={getStatusColor(campaign.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{campaign.targetAudience || 'All'}</TableCell>
                  <TableCell>{formatDate(campaign.startDate)}</TableCell>
                  <TableCell>{formatDate(campaign.endDate)}</TableCell>
                  <TableCell>${campaign.budget?.toLocaleString() || '0'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        component={Link} 
                        to={`/marketing/campaigns/edit/${campaign._id}`} 
                        size="small" 
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(campaign)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {campaigns.length === 0 ? (
                    <Typography>No campaigns found. Create your first campaign!</Typography>
                  ) : (
                    <Typography>No campaigns match your search criteria.</Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
      >
        <DialogTitle>Delete Campaign</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the campaign "{campaignToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CampaignList;
