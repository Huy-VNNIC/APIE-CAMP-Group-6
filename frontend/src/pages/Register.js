import React, { useState, useContext } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
// import { useTranslation } from 'react-i18next';

const Register = () => {
  // const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'student'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { setToken, setUser, setIsAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Cố gắng đăng ký với:', {
        ...formData,
        password: '[HIDDEN]',
        confirmPassword: '[HIDDEN]'
      });
      
      // Sử dụng URL backend trực tiếp
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Phản hồi đăng ký:', response.data);
      
      if (response.data && response.data.token) {
        // Lưu token vào localStorage
        localStorage.setItem('token', response.data.token);
        
        // Cập nhật context
        setToken(response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        setSuccess(true);
        
        // Chuyển hướng sau 1.5 giây
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        console.error('Định dạng phản hồi không hợp lệ:', response.data);
        setError('Đăng ký không thành công: Định dạng phản hồi không hợp lệ');
      }
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      
      if (err.response) {
        console.error('Phản hồi lỗi:', err.response.data);
        setError(err.response.data.message || 'Đăng ký không thành công. Vui lòng thử lại.');
      } else if (err.request) {
        console.error('Không nhận được phản hồi:', err.request);
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và backend.');
      } else {
        console.error('Lỗi thiết lập yêu cầu:', err.message);
        setError('Có lỗi xảy ra: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };
  
  if (success) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 'calc(100vh - 64px)' 
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            maxWidth: 400,
            mx: 2,
            textAlign: 'center'
          }}
        >
          <Alert severity="success" sx={{ mb: 2 }}>
            Đăng ký thành công! Đang chuyển hướng...
          </Alert>
          <CircularProgress sx={{ mt: 2 }} />
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 64px)',
        py: 3
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 500,
          mx: 2
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Đăng ký
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên đăng nhập"
            name="username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
            autoFocus
          />
          
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <TextField
            label="Họ tên đầy đủ"
            name="fullName"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          
          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            helperText="Mật khẩu có ít nhất 6 ký tự"
          />
          
          <TextField
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Vai trò</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              label="Vai trò"
              onChange={handleChange}
            >
              <MenuItem value="student">Học viên</MenuItem>
              <MenuItem value="instructor">Giảng viên</MenuItem>
            </Select>
            <FormHelperText>Chọn vai trò của bạn trong hệ thống</FormHelperText>
          </FormControl>
          
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
              "Đăng ký"
            )}
          </Button>
        </form>
        
        <Typography variant="body2" align="center">
          Đã có tài khoản?{' '}
          <Button
            onClick={handleLoginClick}
            color="primary"
            sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
          >
            Đăng nhập
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
