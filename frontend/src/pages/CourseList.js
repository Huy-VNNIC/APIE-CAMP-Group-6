import React from 'react';
import { Typography, Box, Grid, Card, CardContent, CardActions, Button } from '@mui/material';

const CourseList = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Danh sách khóa học</Typography>
      <Typography variant="body1" paragraph>
        Khám phá các khóa học lập trình hiện có trên nền tảng.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>JavaScript Cơ bản</Typography>
              <Typography variant="body2" color="text.secondary">
                Học JavaScript từ cơ bản đến nâng cao với các bài thực hành tương tác.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Xem chi tiết</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Python cho người mới bắt đầu</Typography>
              <Typography variant="body2" color="text.secondary">
                Làm quen với Python thông qua các bài học và dự án thực tế.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Xem chi tiết</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Web Development</Typography>
              <Typography variant="body2" color="text.secondary">
                Học cách xây dựng trang web sử dụng HTML, CSS và JavaScript.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Xem chi tiết</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseList;
