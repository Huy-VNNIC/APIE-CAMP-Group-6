import React, { useState, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  TextField, 
  Button, 
  Divider, 
  Alert,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { UserContext } from '../contexts/UserContext';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    bio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In real app, this would be an API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Không thể cập nhật hồ sơ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hồ sơ người dùng
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Hồ sơ đã được cập nhật thành công!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Profile info card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: 'primary.main',
                  mb: 2
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || <PersonIcon fontSize="large" />}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user?.username || 'Username'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.role === 'student' ? 'Học viên' : 
                 user?.role === 'instructor' ? 'Giảng viên' : 'Người dùng'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Họ và tên"
                  secondary={user?.fullName || 'Chưa cập nhật'}
                />
              </ListItem>
              
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={user?.email || 'Chưa cập nhật'}
                />
              </ListItem>
            </List>
          </Paper>
          
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin tài khoản
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tài khoản đã được tạo và đang hoạt động.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Đổi mật khẩu
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Profile edit form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                {isEditing ? 'Chỉnh sửa thông tin' : 'Thông tin cá nhân'}
              </Typography>
              
              {!isEditing && (
                <Button 
                  variant="outlined" 
                  onClick={handleEditToggle}
                  startIcon={<PersonIcon />}
                >
                  Chỉnh sửa
                </Button>
              )}
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Họ và tên"
                  name="fullName"
                  fullWidth
                  value={profileData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  value={profileData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Giới thiệu"
                  name="bio"
                  fullWidth
                  multiline
                  rows={4}
                  value={profileData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                  placeholder="Thêm một chút giới thiệu về bản thân..."
                  helperText={isEditing ? "Viết một vài điều về bản thân và sở thích của bạn" : ""}
                />
              </Grid>
              
              {isEditing && (
                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleEditToggle}
                    disabled={loading}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
          
          {/* Activity section */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hoạt động gần đây
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CodeIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        Khóa học đã đăng ký
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="text.secondary">
                      {user?.role === 'student' ? '3' : '0'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SchoolIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        {user?.role === 'student' ? 'Bài tập đã hoàn thành' : 'Khóa học đã tạo'}
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="text.secondary">
                      {user?.role === 'student' ? '12' : '2'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
