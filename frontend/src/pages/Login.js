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
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
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
    
    // Mock login logic - in a real app, this would call an API
    try {
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
      
      // If none of the mock accounts match, show error
      setError('Invalid username or password');
    } catch (err) {
      console.error('Login error:', err);
      setError(t('errors.login_failed'));
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
          {t('auth.login_title')}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t('auth.username')}
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label={t('auth.password')}
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
              label={t('auth.remember_me')}
            />
            
            <Link component="button" variant="body2" onClick={() => alert('Password reset functionality')}>
              {t('auth.forgot_password')}
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
              t('auth.sign_in')
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              {t('auth.no_account')}{' '}
              <Link component={RouterLink} to="/register" variant="body2">
                {t('auth.sign_up')}
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
