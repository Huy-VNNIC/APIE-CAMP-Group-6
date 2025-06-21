import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Container, Typography, Grid, Paper, Box, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Campaign as CampaignIcon, 
  Article as ContentIcon, 
  Handshake as PartnershipIcon, 
  Analytics as AnalyticsIcon 
} from '@mui/icons-material';
import { getAllCampaigns, getMetricsSummary } from '../../services/marketingService';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MarketingDashboard = () => {
  const { user } = useContext(UserContext);
  const [campaigns, setCampaigns] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch campaigns
        const campaignResponse = await getAllCampaigns();
        setCampaigns(campaignResponse?.data || []);
        
        // Fetch metrics summary
        const metricsResponse = await getMetricsSummary();
        setMetrics(metricsResponse?.data || {});
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching marketing dashboard data:', error);
        setError('Failed to load marketing dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sample data for charts
  const engagementData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Users',
        data: [1200, 1900, 1500, 2500, 2800, 3200],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const conversionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Course Enrollments',
        data: [50, 75, 60, 120, 150, 180],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4">Loading marketing dashboard...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Marketing Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Welcome, {user?.fullName || 'Marketing Manager'}!
        </Typography>
      </Box>

      {/* Quick Action Cards */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={Link} 
            to="/marketing/campaigns" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <CampaignIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" component="h2">
                Campaigns
              </Typography>
              <Typography color="text.secondary">
                Manage marketing campaigns
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={Link} 
            to="/marketing/promotional-content" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <ContentIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" component="h2">
                Content
              </Typography>
              <Typography color="text.secondary">
                Manage promotional content
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={Link} 
            to="/marketing/partnerships" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <PartnershipIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" component="h2">
                Partnerships
              </Typography>
              <Typography color="text.secondary">
                Manage partnerships
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={Link} 
            to="/marketing/metrics" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <AnalyticsIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
              <Typography variant="h6" component="h2">
                Analytics
              </Typography>
              <Typography color="text.secondary">
                View engagement metrics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Summary */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" gutterBottom>
            Performance Overview
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'primary.light',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography variant="body2">Active Campaigns</Typography>
            <Typography variant="h4">
              {campaigns.filter(c => c.status === 'active').length || 0}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.light',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography variant="body2">Total Users</Typography>
            <Typography variant="h4">
              {metrics?.totalActiveUsers?.toLocaleString() || 0}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'warning.light',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography variant="body2">Course Enrollments</Typography>
            <Typography variant="h4">
              {metrics?.totalEnrollments?.toLocaleString() || 0}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'info.light',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography variant="body2">Avg. Session (min)</Typography>
            <Typography variant="h4">
              {Math.round((metrics?.avgSessionDuration || 0) / 60)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 350,
            }}
          >
            <Typography variant="h6" component="h3" gutterBottom>
              User Engagement Trends
            </Typography>
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Line 
                data={engagementData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 350,
            }}
          >
            <Typography variant="h6" component="h3" gutterBottom>
              Course Enrollment Conversions
            </Typography>
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bar 
                data={conversionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Campaigns */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h3">
                Recent Campaigns
              </Typography>
              <Button component={Link} to="/marketing/campaigns" color="primary">
                View All
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {campaigns.slice(0, 4).map((campaign) => (
                <Grid item xs={12} sm={6} md={3} key={campaign._id}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" component="h4" gutterBottom>
                      {campaign.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {campaign.description}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        bgcolor: 
                          campaign.status === 'active' ? 'success.light' : 
                          campaign.status === 'draft' ? 'info.light' : 
                          campaign.status === 'completed' ? 'primary.light' : 'warning.light',
                        color: 'white'
                      }}>
                        {campaign.status}
                      </Typography>
                      <Button 
                        component={Link} 
                        to={`/marketing/campaigns/${campaign._id}`} 
                        size="small"
                      >
                        View
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
              
              {campaigns.length === 0 && (
                <Grid item xs={12}>
                  <Typography align="center" color="text.secondary">
                    No campaigns found. Create your first campaign!
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MarketingDashboard;
