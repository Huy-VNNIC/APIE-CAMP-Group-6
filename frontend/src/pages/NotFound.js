import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)'
      }}
    >
      <Typography variant="h1" component="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Không tìm thấy trang
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Quay về Trang chủ
      </Button>
    </Box>
  );
};

export default NotFound;
