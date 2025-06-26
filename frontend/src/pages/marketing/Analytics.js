import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent,
  Select, MenuItem, FormControl, InputLabel, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Mouse as ClickIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Campaign as CampaignIcon,
  Business as BusinessIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { getEngagementMetrics } from '../../services/marketingService';

const Analytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  // Mock data for demonstration
  const mockMetrics = {
    overview: {
      totalImpressions: 125430,
      totalClicks: 7825,
      totalConversions: 342,
      totalRevenue: 28500,
      averageCTR: 6.2,
      averageConversionRate: 4.4,
      activeCampaigns: 8,
      activePartnerships: 12
    },
    campaignPerformance: [
      {
        id: '1',
        name: 'Learn Web Development - From Zero to Hero',
        impressions: 45230,
        clicks: 2805,
        conversions: 126,
        revenue: 12600,
        ctr: 6.2,
        conversionRate: 4.5,
        status: 'active'
      },
      {
        id: '2',
        name: 'Advanced JavaScript Masterclass',
        impressions: 32150,
        clicks: 1980,
        conversions: 89,
        revenue: 8900,
        ctr: 6.2,
        conversionRate: 4.5,
        status: 'active'
      },
      {
        id: '3',
        name: 'Mobile App Development Course',
        impressions: 28940,
        clicks: 1654,
        conversions: 67,
        revenue: 6700,
        ctr: 5.7,
        conversionRate: 4.1,
        status: 'active'
      },
      {
        id: '4',
        name: 'Internet Programming Promotion',
        impressions: 19110,
        clicks: 1386,
        conversions: 60,
        revenue: 300,
        ctr: 7.3,
        conversionRate: 4.3,
        status: 'active'
      }
    ],
    contentPerformance: [
      {
        type: 'Email',
        count: 24,
        avgCTR: 8.2,
        totalClicks: 3420
      },
      {
        type: 'Social Media',
        count: 18,
        avgCTR: 5.8,
        totalClicks: 2186
      },
      {
        type: 'Banner',
        count: 12,
        avgCTR: 4.1,
        totalClicks: 1890
      },
      {
        type: 'Video',
        count: 6,
        avgCTR: 9.5,
        totalClicks: 329
      }
    ],
    partnershipMetrics: [
      {
        name: 'Tech University',
        studentsReached: 2500,
        coursesCompleted: 180,
        revenue: 45000,
        status: 'active'
      },
      {
        name: 'StartupHub Incubator',
        studentsReached: 850,
        coursesCompleted: 95,
        revenue: 125000,
        status: 'active'
      },
      {
        name: 'CodeForGood NGO',
        studentsReached: 1200,
        coursesCompleted: 75,
        revenue: 0,
        status: 'active'
      }
    ]
  };

  // Fetch metrics on component mount
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        // Try to fetch from API, fall back to mock data
        try {
          const response = await getEngagementMetrics(timeRange, selectedCampaign);
          setMetrics(response.data);
        } catch (apiError) {
          console.log('API not available, using mock data');
          setMetrics(mockMetrics);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load analytics. Please try again.');
        setLoading(false);
        console.error('Error fetching metrics:', err);
      }
    };

    fetchMetrics();
  }, [timeRange, selectedCampaign]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const MetricCard = ({ title, value, icon, color = 'primary', change }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
            {change && (
              <Chip
                label={`${change > 0 ? '+' : ''}${change}%`}
                color={change > 0 ? 'success' : 'error'}
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Box sx={{ color: `${color}.main`, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading analytics...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Marketing Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="7days">Last 7 days</MenuItem>
              <MenuItem value="30days">Last 30 days</MenuItem>
              <MenuItem value="90days">Last 3 months</MenuItem>
              <MenuItem value="1year">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => alert('Export functionality coming soon!')}
          >
            Export
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Overview Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Impressions"
            value={formatNumber(metrics?.overview?.totalImpressions || 0)}
            icon={<VisibilityIcon />}
            change={15.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Clicks"
            value={formatNumber(metrics?.overview?.totalClicks || 0)}
            icon={<ClickIcon />}
            color="success"
            change={8.7}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversions"
            value={formatNumber(metrics?.overview?.totalConversions || 0)}
            icon={<PeopleIcon />}
            color="warning"
            change={12.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Revenue"
            value={formatCurrency(metrics?.overview?.totalRevenue || 0)}
            icon={<MoneyIcon />}
            color="error"
            change={22.1}
          />
        </Grid>
      </Grid>

      {/* Additional KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Average CTR"
            value={`${metrics?.overview?.averageCTR || 0}%`}
            icon={<TrendingUpIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value={`${metrics?.overview?.averageConversionRate || 0}%`}
            icon={<TrendingUpIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Campaigns"
            value={metrics?.overview?.activeCampaigns || 0}
            icon={<CampaignIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Partnerships"
            value={metrics?.overview?.activePartnerships || 0}
            icon={<BusinessIcon />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Campaign Performance */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Campaign Performance
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Campaign Name</TableCell>
                <TableCell align="right">Impressions</TableCell>
                <TableCell align="right">Clicks</TableCell>
                <TableCell align="right">CTR</TableCell>
                <TableCell align="right">Conversions</TableCell>
                <TableCell align="right">Conv. Rate</TableCell>
                <TableCell align="right">Revenue</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {metrics?.campaignPerformance?.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell align="right">{formatNumber(campaign.impressions)}</TableCell>
                  <TableCell align="right">{formatNumber(campaign.clicks)}</TableCell>
                  <TableCell align="right">{campaign.ctr}%</TableCell>
                  <TableCell align="right">{formatNumber(campaign.conversions)}</TableCell>
                  <TableCell align="right">{campaign.conversionRate}%</TableCell>
                  <TableCell align="right">{formatCurrency(campaign.revenue)}</TableCell>
                  <TableCell>
                    <Chip
                      label={campaign.status}
                      color={campaign.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Content Performance & Partnership Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Content Performance
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Content Type</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Avg CTR</TableCell>
                    <TableCell align="right">Total Clicks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics?.contentPerformance?.map((content, index) => (
                    <TableRow key={index}>
                      <TableCell>{content.type}</TableCell>
                      <TableCell align="right">{content.count}</TableCell>
                      <TableCell align="right">{content.avgCTR}%</TableCell>
                      <TableCell align="right">{formatNumber(content.totalClicks)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Partnership Metrics
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Partner</TableCell>
                    <TableCell align="right">Students</TableCell>
                    <TableCell align="right">Completed</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics?.partnershipMetrics?.map((partner, index) => (
                    <TableRow key={index}>
                      <TableCell>{partner.name}</TableCell>
                      <TableCell align="right">{formatNumber(partner.studentsReached)}</TableCell>
                      <TableCell align="right">{formatNumber(partner.coursesCompleted)}</TableCell>
                      <TableCell align="right">{formatCurrency(partner.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;
