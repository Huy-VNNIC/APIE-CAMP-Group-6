import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, Box, AppBar, Toolbar, Typography, Button, Container, TextField, Paper, Alert } from '@mui/material';

// Simple Login Component
const SimpleLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'marketing' && password === 'marketing123') {
      onLogin({ username: 'marketing', role: 'marketing' });
    } else {
      setError('Invalid credentials. Use marketing/marketing123');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Demo Account: marketing / marketing123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

// Simple Marketing Dashboard
const MarketingDashboard = ({ user, onLogout }) => {
  const [prompt, setPrompt] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateCampaigns = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || 'mock-token';
      const response = await fetch('http://localhost:5001/api/marketing/ai/campaign-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      if (data.success && data.ideas) {
        setCampaigns(data.ideas);
      } else {
        // Fallback campaigns
        setCampaigns([
          {
            title: "Learn Web Development - From Zero to Hero",
            description: "A comprehensive online program teaching HTML, CSS, JavaScript, React, and Node.js. Build real projects and get job-ready skills in 6 months.",
            targetAudience: "students",
            audienceDescription: "Beginners and career changers looking to enter web development",
            channels: ["email", "social", "website", "push"]
          },
          {
            title: "Advanced Internet Technologies Bootcamp", 
            description: "Master modern web technologies including cloud computing, API development, microservices, and deployment strategies.",
            targetAudience: "students",
            audienceDescription: "Intermediate to advanced developers and IT professionals",
            channels: ["email", "website", "social"]
          }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback campaigns on error
      setCampaigns([
        {
          title: "Internet Programming Fundamentals",
          description: "Learn the basics of web development and internet programming with hands-on projects.",
          targetAudience: "students",
          audienceDescription: "Beginners interested in web development",
          channels: ["email", "social", "website"]
        }
      ]);
    }
    setLoading(false);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Marketing Dashboard
          </Typography>
          <Typography sx={{ mr: 2 }}>Welcome, {user.username}</Typography>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          AI Campaign Generator
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generate Campaign Ideas
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Describe your campaign needs"
            placeholder="Create marketing campaigns for internet programming courses..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button 
            variant="contained" 
            onClick={generateCampaigns}
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Generating...' : 'Generate Campaign Ideas'}
          </Button>
        </Paper>

        {campaigns.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Generated Campaign Ideas
            </Typography>
            {campaigns.map((campaign, index) => (
              <Paper key={index} sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {campaign.title}
                </Typography>
                <Typography paragraph>
                  {campaign.description}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Target: {campaign.audienceDescription}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Channels: {campaign.channels?.join(', ')}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

// Simple App Component
const SimpleApp = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('token', 'mock-token-marketing-123');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div>
      <CssBaseline />
      <BrowserRouter>
        {!user ? (
          <SimpleLogin onLogin={handleLogin} />
        ) : (
          <MarketingDashboard user={user} onLogout={handleLogout} />
        )}
      </BrowserRouter>
    </div>
  );
};

export default SimpleApp;
