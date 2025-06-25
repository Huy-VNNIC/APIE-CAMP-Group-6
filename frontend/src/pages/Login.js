import React, { useState, useContext } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  FormControlLabel, 
  Checkbox,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
// import { useTranslation } from 'react-i18next'; // Temporarily disabled

const Login = () => {
  // const { t } = useTranslation(); // Temporarily disabled
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate input
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    
    setLoading(true);
    
    try {
      // First try real API login
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.token) {
            // Store user data in context
            login(data.user, data.token);
            
            // Navigate based on role
            if (data.user.role === 'marketing') {
              navigate('/marketing');
            } else if (data.user.role === 'instructor') {
              navigate('/instructor');
            } else {
              navigate('/');
            }
            return;
          }
        }
      } catch (apiError) {
        console.log('API login failed, trying mock logins');
        // If API login fails, continue to mock logins
      }
      
      // Check for marketing mock login
      if (username === 'marketing' && password === 'marketing123') {
        // Mock marketing login
        const userData = {
          id: 'marketing-123',
          username: 'marketing',
          fullName: 'Marketing Manager',
          email: 'marketing@example.com',
          role: 'marketing'
        };
        
        // Store user data in context
        login(userData, 'mock-token-marketing-123');
        
        // Navigate to marketing dashboard
        navigate('/marketing');
        return;
      }
      
      // Check for instructor mock login
      if (username === 'instructor' && password === 'instructor123') {
        // Mock instructor login
        const userData = {
          id: 'instructor-123',
          username: 'instructor',
          fullName: 'John Smith',
          email: 'instructor@example.com',
          role: 'instructor'
        };
        
        // Store user data in context
        login(userData, 'mock-token-instructor-123');
        
        // Navigate to dashboard after successful login
        navigate('/instructor');
        return;
      }
      
      // Check for student mock login
      if (username === 'student' && password === 'student123') {
        // Mock student login
        const userData = {
          id: 'student-123',
          username: 'student',
          fullName: 'Jane Doe',
          email: 'student@example.com',
          role: 'student'
        };
        
        // Store user data in context
        login(userData, 'mock-token-student-123');
        
        // Navigate to dashboard after successful login
        navigate('/');
        return;
      }
      
      // If none of the accounts match, show error
      setError('Invalid username or password');
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                  disabled={loading}
                />
              }
              label="Remember me"
            />
            
            <Link component="button" variant="body2" onClick={() => alert('Password reset functionality')}>
              Forgot password?
            </Link>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" variant="body2">
                Sign Up
              </Link>
            </Typography>
          </Box>
          
          {/* Mock login info for demo purposes */}
          <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Demo Accounts:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Instructor:</strong> username: instructor / password: instructor123
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Student:</strong> username: student / password: student123
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
