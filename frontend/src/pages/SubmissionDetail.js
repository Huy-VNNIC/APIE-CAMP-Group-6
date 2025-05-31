import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Divider, Chip, Alert, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeRunner from '../components/CodeRunner';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const SubmissionDetail = () => {
  const { submissionId } = useParams();
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchSubmission();
  }, [submissionId, token]);
  
  const fetchSubmission = async () => {
    try {
      const response = await axios.get(`/api/code/submissions/${submissionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSubmission(response.data.submission);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching submission:', err);
      setError('Không thể tải thông tin bài nộp');
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>
      
      {submission && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Chi tiết bài nộp
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Chip 
                label={`Khóa học: ${submission.course_title}`} 
                variant="outlined" 
                clickable
                onClick={() => navigate(`/courses/${submission.course_id}`)}
              />
              
              <Chip 
                label={`Bài học: ${submission.resource_title}`} 
                variant="outlined"
              />
              
              <Chip 
                label={`Ngôn ngữ: ${submission.language}`} 
                color="primary" 
                variant="outlined"
              />
              
              <Chip 
                label={`Trạng thái: ${
                  submission.status === 'graded' ? 'Đã chấm' : 
                  submission.status === 'error' ? 'Lỗi' : 'Đang chờ'
                }`} 
                color={
                  submission.status === 'graded' ? 'success' : 
                  submission.status === 'error' ? 'error' : 'warning'
                }
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Nộp lúc: {new Date(submission.submitted_at).toLocaleString()}
            </Typography>
          </Paper>
          
          <CodeRunner 
            submissionId={submissionId}
            courseId={submission.course_id}
            resourceId={submission.resource_id}
          />
        </>
      )}
    </Box>
  );
};

export default SubmissionDetail;