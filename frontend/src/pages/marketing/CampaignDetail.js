import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Paper, Chip, Button,
  CircularProgress, Divider, Card, CardContent, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  Campaign as CampaignIcon,
  Article as ContentIcon,
  Analytics as AnalyticsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { 
  getCampaignById, 
  deleteCampaign,
  getPromotionalContentByCampaign, 
  getMetricsByCampaign 
} from '../../services/marketingService';
import DeleteConfirmationDialog from '../../components/marketing/DeleteConfirmationDialog';

// Custom TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`campaign-tabpanel-${index}`}
      aria-labelledby={`campaign-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [campaign, setCampaign] = useState(null);
  const [promotionalContent, setPromotionalContent] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch campaign data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch campaign details
        const campaignResponse = await getCampaignById(id);
        setCampaign(campaignResponse.data);
        
        // Fetch promotional content for this campaign
        const contentResponse = await getPromotionalContentByCampaign(id);
        setPromotionalContent(contentResponse.data || []);
        
        // Fetch metrics for this campaign
        const metricsResponse = await getMetricsByCampaign(id);
        setMetrics(metricsResponse.data || []);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load campaign data.');
        setLoading(false);
        console.error('Error fetching campaign details:', err);
      }
    };

    fetchData();
  }, [id]);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Delete campaign handler
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCampaign(id);
      setDeleteDialogOpen(false);
      navigate('/marketing/campaigns');
    } catch (err) {
      setError('Failed to delete campaign.');
      console.error('Error deleting campaign:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  if (loading) {
    return (
      <Container sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !campaign) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error || 'Campaign not found.'}</Typography>
        <Button component={Link} to="/marketing/campaigns" sx={{ mt: 2 }}>
          Back to Campaigns
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CampaignIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
          <Typography variant="h4" component="h1">
            {campaign.title}
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined"
            startIcon={<EditIcon />}
            component={Link}
            to={`/marketing/campaigns/edit/${id}`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Campaign Overview Card */}
      <Paper sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Overview</Typography>
            <Typography paragraph>{campaign.description}</Typography>
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {campaign.channels?.map((channel) => (
                <Chip 
                  key={channel} 
                  label={channel.charAt(0).toUpperCase() + channel.slice(1)} 
                  variant="outlined" 
                  size="small"
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={campaign.status} 
                    color={getStatusColor(campaign.status)} 
                  />
                </Box>
                
                <Typography variant="subtitle2" color="text.secondary">Target Audience</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {campaign.targetAudience?.charAt(0).toUpperCase() + campaign.targetAudience?.slice(1) || 'All Users'}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">Budget</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  ${campaign.budget?.toLocaleString() || '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<ContentIcon />} label="Content" iconPosition="start" />
            <Tab icon={<AnalyticsIcon />} label="Metrics" iconPosition="start" />
          </Tabs>
        </Box>
        
        {/* Content Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Promotional Content</Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to={`/marketing/promotional-content/new?campaignId=${id}`}
            >
              Add Content
            </Button>
          </Box>
          
          {promotionalContent.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Views</TableCell>
                    <TableCell>Clicks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {promotionalContent.map((content) => (
                    <TableRow key={content._id}>
                      <TableCell>
                        <Link 
                          to={`/marketing/promotional-content/${content._id}`}
                          style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                        >
                          {content.title}
                        </Link>
                      </TableCell>
                      <TableCell>{content.contentType}</TableCell>
                      <TableCell>
                        <Chip 
                          label={content.status} 
                          color={
                            content.status === 'published' ? 'success' :
                            content.status === 'draft' ? 'info' : 'default'
                          } 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{content.metrics?.views || 0}</TableCell>
                      <TableCell>{content.metrics?.clicks || 0}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          component={Link}
                          to={`/marketing/promotional-content/edit/${content._id}`}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No promotional content found for this campaign.</Typography>
          )}
        </TabPanel>
        
        {/* Metrics Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Performance Metrics</Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to={`/marketing/metrics/new?campaignId=${id}`}
            >
              Add Metrics
            </Button>
          </Box>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                <Typography variant="body2">Impressions</Typography>
                <Typography variant="h4">
                  {campaign.metrics?.impressions?.toLocaleString() || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                <Typography variant="body2">Clicks</Typography>
                <Typography variant="h4">
                  {campaign.metrics?.clicks?.toLocaleString() || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
                <Typography variant="body2">Conversions</Typography>
                <Typography variant="h4">
                  {campaign.metrics?.conversions?.toLocaleString() || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
                <Typography variant="body2">Engagement</Typography>
                <Typography variant="h4">
                  {campaign.metrics?.engagement?.toLocaleString() || 0}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {metrics.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Active Users</TableCell>
                    <TableCell>Page Views</TableCell>
                    <TableCell>Enrollments</TableCell>
                    <TableCell>Completions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric._id}>
                      <TableCell>{formatDate(metric.date)}</TableCell>
                      <TableCell>{metric.source}</TableCell>
                      <TableCell>{metric.metrics?.activeUsers || 0}</TableCell>
                      <TableCell>{metric.metrics?.pageViews || 0}</TableCell>
                      <TableCell>{metric.metrics?.courseEnrollments || 0}</TableCell>
                      <TableCell>{metric.metrics?.courseCompletions || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No metrics data found for this campaign.</Typography>
          )}
        </TabPanel>
      </Paper>

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Campaign"
        contentText={`Are you sure you want to delete the campaign "${campaign.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Container>
  );
};

export default CampaignDetail;
