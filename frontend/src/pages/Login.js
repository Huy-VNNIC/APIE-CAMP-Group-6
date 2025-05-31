import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setToken, setUser, setIsAuthenticated, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu người dùng đã đăng nhập, chuyển hướng đến trang chủ
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Đang cố gắng đăng nhập với:', { username, password });

      // Sử dụng API endpoint trực tiếp và đầy đủ
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      
      console.log('Phản hồi đăng nhập:', response);
      
      if (response.data && response.data.token) {
        console.log('Đăng nhập thành công, token:', response.data.token);
        
        // Lưu token vào localStorage
        localStorage.setItem('token', response.data.token);
        
        // Cập nhật context
        setToken(response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Chuyển hướng đến trang chủ
        navigate('/');
      } else {
        console.error('Định dạng phản hồi không hợp lệ:', response.data);
        setError(t('errors.login_failed'));
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      
      if (err.response) {
        console.error('Chi tiết lỗi từ server:', err.response.data);
        setError(err.response.data.message || t('errors.login_failed'));
      } else if (err.request) {
        console.error('Không nhận được phản hồi:', err.request);
        setError(t('errors.connection_error'));
      } else {
        console.error('Lỗi thiết lập request:', err.message);
        setError(t('errors.server_error') + ': ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 120px)' 
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 400,
          mx: 2
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
        
        <form onSubmit={handleSubmit}>
          <TextField
            label={t('auth.username')}
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            disabled={loading}
          />
          
          <TextField
            label={t('auth.password')}
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('auth.login_title')
            )}
          </Button>
        </form>
        
        <Typography variant="body2" align="center">
          {t('auth.no_account')}{' '}
          <Button
            onClick={handleRegisterClick}
            color="primary"
            sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
            disabled={loading}
          >
            {t('auth.sign_up')}
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
