import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

function AnalyticsNew() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const metrics = {
    totalImpressions: 125430,
    totalClicks: 7825,
    totalConversions: 342,
    totalRevenue: 285000,
    activeCampaigns: 8
  };

  const campaigns = [
    {
      id: 1,
      name: 'React Development Bootcamp',
      impressions: 45320,
      clicks: 2890,
      conversions: 156,
      revenue: 15600,
      status: 'active'
    },
    {
      id: 2,
      name: 'Advanced JavaScript Masterclass',
      impressions: 32150,
      clicks: 1980,
      conversions: 89,
      revenue: 8900,
      status: 'active'
    },
    {
      id: 3,
      name: 'Mobile App Development Course',
      impressions: 28940,
      clicks: 1654,
      conversions: 67,
      revenue: 6700,
      status: 'active'
    }
  ];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading analytics...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📊 Marketing Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Track your marketing performance and campaign metrics
        </Typography>
      </Box>

      {/* Overview Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Impressions
              </Typography>
              <Typography variant="h5">
                {formatNumber(metrics.totalImpressions)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Clicks
              </Typography>
              <Typography variant="h5">
                {formatNumber(metrics.totalClicks)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Conversions
              </Typography>
              <Typography variant="h5">
                {formatNumber(metrics.totalConversions)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Revenue
              </Typography>
              <Typography variant="h5">
                {formatCurrency(metrics.totalRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Campaigns
              </Typography>
              <Typography variant="h5">
                {metrics.activeCampaigns}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Campaign Performance Table */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Campaign Performance
          </Typography>
          <Button variant="outlined">
            Export Data
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Campaign Name</TableCell>
                <TableCell align="right">Impressions</TableCell>
                <TableCell align="right">Clicks</TableCell>
                <TableCell align="right">Conversions</TableCell>
                <TableCell align="right">Revenue</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell align="right">
                    {formatNumber(campaign.impressions)}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(campaign.clicks)}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(campaign.conversions)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(campaign.revenue)}
                  </TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        backgroundColor: campaign.status === 'active' ? 'success.light' : 'grey.300',
                        color: campaign.status === 'active' ? 'success.dark' : 'text.secondary',
                        fontSize: '0.75rem',
                        fontWeight: 'medium',
                        textTransform: 'uppercase'
                      }}
                    >
                      {campaign.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Charts Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          📈 Performance Charts
        </Typography>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Charts Coming Soon
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Interactive charts and graphs will be available in the next update.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default AnalyticsNew;
