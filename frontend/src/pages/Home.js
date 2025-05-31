import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';

const Home = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <CodeIcon fontSize="large" color="primary" />,
      title: 'Code Playground',
      description: 'Thực hành lập trình với nhiều ngôn ngữ khác nhau trong môi trường trực tuyến'
    },
    {
      icon: <SchoolIcon fontSize="large" color="primary" />,
      title: 'Khóa học',
      description: 'Khóa học đa dạng từ cơ bản đến nâng cao phù hợp với mọi trình độ'
    },
    {
      icon: <GroupIcon fontSize="large" color="primary" />,
      title: 'Cộng đồng',
      description: 'Trao đổi kiến thức và kết nối với cộng đồng lập trình viên'
    }
  ];
  
  return (
    <Box>
      {/* Hero section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          mb: 6
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Học lập trình trực tuyến
        </Typography>
        <Typography variant="h5" component="p" gutterBottom sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          Nền tảng học tập tương tác giúp bạn nâng cao kỹ năng lập trình một cách hiệu quả
        </Typography>
        <Button 
          variant="contained" 
          color="secondary"
          size="large"
          onClick={() => navigate('/playground')}
          sx={{ mr: 2 }}
        >
          Thử ngay Code Playground
        </Button>
        <Button 
          variant="outlined" 
          color="inherit"
          size="large"
          onClick={() => navigate('/courses')}
        >
          Xem khóa học
        </Button>
      </Box>
      
      {/* Features section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Tính năng nổi bật
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography gutterBottom variant="h5" component="h3">
                  {feature.title}
                </Typography>
                <Typography>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* CTA section */}
      <Box sx={{ bgcolor: 'grey.100', p: 4, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Bắt đầu ngay hôm nay
        </Typography>
        <Typography variant="body1" paragraph>
          Tạo tài khoản miễn phí và bắt đầu hành trình học lập trình của bạn
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          onClick={() => navigate('/register')}
        >
          Đăng ký miễn phí
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
