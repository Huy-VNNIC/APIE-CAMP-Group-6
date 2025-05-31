import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Paper, Divider, List, ListItem, ListItemText, Button } from '@mui/material';

const CourseDetail = () => {
  const { courseId } = useParams();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Chi tiết khóa học</Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        ID khóa học: {courseId}
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>JavaScript Cơ bản</Typography>
        <Typography variant="body1" paragraph>
          Khóa học này sẽ giúp bạn nắm vững JavaScript từ nền tảng đến các kỹ thuật nâng cao.
          Phù hợp cho người mới bắt đầu lập trình.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>Nội dung khóa học</Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="Bài 1: Giới thiệu về JavaScript" 
              secondary="Tìm hiểu JavaScript là gì và cách sử dụng trong web development"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Bài 2: Biến và Kiểu dữ liệu" 
              secondary="Tìm hiểu về các kiểu dữ liệu và cách sử dụng biến trong JavaScript"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Bài 3: Hàm và Điều kiện" 
              secondary="Học cách xây dựng hàm và sử dụng các câu lệnh điều kiện"
            />
          </ListItem>
        </List>
        
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Đăng ký học
        </Button>
      </Paper>
    </Box>
  );
};

export default CourseDetail;
