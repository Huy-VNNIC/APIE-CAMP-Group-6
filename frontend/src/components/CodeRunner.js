import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Tabs, Tab, Box, Typography, Paper, TextField, MenuItem, CircularProgress } from '@mui/material';
import CodeEditor from './CodeEditor'; // Giả sử bạn có component CodeEditor

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'html', label: 'HTML' },
  { value: 'python', label: 'Python' },
  { value: 'php', label: 'PHP' }
];

const templates = {
  javascript: `// JavaScript Code Template
console.log('Hello World!');

// Export a function to be accessed via API
module.exports = function(params) {
  return {
    message: "Hello from JavaScript!",
    params: params
  };
};`,
  
  html: `<!DOCTYPE html>
<html>
<head>
  <title>My Web Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      line-height: 1.6;
    }
    h1 {
      color: #4a90e2;
    }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first web page.</p>
  
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Page loaded!');
    });
  </script>
</body>
</html>`,
  
  python: `# Python Code Template
def main():
    print("Hello from Python!")
    return {"message": "Hello from Python!"}

if __name__ == "__main__":
    main()`,
    
  php: `<?php
// PHP Code Template
echo "<h1>Hello from PHP!</h1>";
echo "<p>Today is " . date("Y-m-d") . "</p>";
`
};

const CodeRunner = ({ resourceId = null, courseId = null, submissionId = null }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [previousSubmissions, setPreviousSubmissions] = useState([]);
  
  useEffect(() => {
    // Nếu có submissionId, lấy thông tin submission
    if (submissionId) {
      fetchSubmission();
    } else {
      // Nếu không, đặt code template dựa vào ngôn ngữ
      setCode(templates[language]);
    }
    
    // Nếu có resourceId và courseId, lấy các submission trước đó
    if (resourceId && courseId) {
      fetchPreviousSubmissions();
    }
  }, [submissionId, resourceId, courseId, language]);
  
  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/code/submissions/${submissionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setCode(response.data.submission.code_text);
      setLanguage(response.data.submission.language);
      
      if (response.data.submission.result) {
        try {
          setResult(JSON.parse(response.data.submission.result));
        } catch (e) {
          setResult(null);
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError('Không thể tải thông tin bài nộp');
      setLoading(false);
    }
  };
  
  const fetchPreviousSubmissions = async () => {
    try {
      const response = await axios.get(`/api/code/my-submissions?resourceId=${resourceId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setPreviousSubmissions(response.data.submissions.filter(sub => 
        sub.resource_id == resourceId && sub.course_id == courseId
      ));
    } catch (err) {
      console.error('Error fetching previous submissions:', err);
    }
  };
  
  const handleRunCode = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/code/run', {
        codeText: code,
        language
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setResult({
        url: response.data.url,
        containerId: response.data.containerId,
        expiresAt: response.data.expiresAt
      });
      
      setActiveTab(1); // Switch to Result tab
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi chạy code');
      setLoading(false);
    }
  };
  
  const handleSubmitCode = async () => {
    if (!resourceId || !courseId) {
      setError('Thiếu thông tin resource hoặc course');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/code/submit', {
        resourceId,
        courseId,
        codeText: code,
        language
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data.submission.result) {
        try {
          setResult(JSON.parse(response.data.submission.result));
        } catch (e) {
          setResult(null);
        }
      }
      
      // Cập nhật danh sách submission
      fetchPreviousSubmissions();
      
      setActiveTab(1); // Switch to Result tab
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi nộp code');
      setLoading(false);
    }
  };
  
  const handleExtendContainer = async () => {
    if (!submissionId || !result?.containerId) return;
    
    try {
      setLoading(true);
      
      const response = await axios.post(`/api/code/submissions/${submissionId}/extend`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setResult(prev => ({
        ...prev,
        expiresAt: response.data.expiresAt
      }));
      
      setLoading(false);
    } catch (err) {
      setError('Không thể gia hạn container');
      setLoading(false);
    }
  };
  
  const handleRerunCode = async () => {
    if (!submissionId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`/api/code/submissions/${submissionId}/rerun`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setResult(response.data.result);
      setActiveTab(1); // Switch to Result tab
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi chạy lại code');
      setLoading(false);
    }
  };
  
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Nếu không phải đang xem submission, đặt lại template
    if (!submissionId) {
      setCode(templates[newLanguage]);
    }
  };
  
  const handleLoadSubmission = (submission) => {
    setCode(submission.code_text);
    setLanguage(submission.language);
    
    if (submission.result) {
      try {
        setResult(JSON.parse(submission.result));
      } catch (e) {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  };
  
  const calculateTimeLeft = (expiresAt) => {
    if (!expiresAt) return null;
    
    const expirationTime = new Date(expiresAt).getTime();
    const now = new Date().getTime();
    const diff = expirationTime - now;
    
    if (diff <= 0) return 'Đã hết hạn';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Code Runner</Typography>
        <TextField
          select
          label="Ngôn ngữ"
          value={language}
          onChange={handleLanguageChange}
          sx={{ width: 200 }}
          size="small"
        >
          {languageOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
        <Tab label="Code Editor" />
        <Tab label="Kết quả" />
        {previousSubmissions.length > 0 && <Tab label="Bài nộp trước đó" />}
      </Tabs>
      
      {activeTab === 0 && (
        <Box>
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            height="400px"
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleRunCode}
              disabled={loading || !code}
            >
              {loading ? <CircularProgress size={24} /> : 'Chạy code'}
            </Button>
            {resourceId && courseId && (
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSubmitCode}
                disabled={loading || !code}
              >
                {loading ? <CircularProgress size={24} /> : 'Nộp bài'}
              </Button>
            )}
            {submissionId && (
              <Button 
                variant="outlined" 
                onClick={handleRerunCode}
                disabled={loading}
              >
                Chạy lại code
              </Button>
            )}
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      )}
      
      {activeTab === 1 && (
        <Box>
          {result && result.url ? (
            <Box>
              <Typography variant="subtitle1">
                Kết quả chạy code:
              </Typography>
              <Box
                sx={{ 
                  mt: 2, 
                  border: '1px solid #ddd', 
                  borderRadius: 1,
                  overflow: 'hidden',
                  height: '400px'
                }}
              >
                <iframe 
                  src={result.url} 
                  title="Code Output"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">
                  URL: <a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a>
                </Typography>
                {result.expiresAt && (
                  <Typography variant="body2">
                    Thời gian còn lại: {calculateTimeLeft(result.expiresAt)}
                  </Typography>
                )}
              </Box>
              {result.containerId && (
                <Button 
                  variant="outlined" 
                  onClick={handleExtendContainer}
                  disabled={loading}
                  sx={{ mt: 1 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Gia hạn thời gian'}
                </Button>
              )}
            </Box>
          ) : loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography>
              Chưa có kết quả. Hãy chạy code trước.
            </Typography>
          )}
        </Box>
      )}
      
      {activeTab === 2 && previousSubmissions.length > 0 && (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Các bài nộp trước đó:
          </Typography>
          {previousSubmissions.map((submission, index) => (
            <Box 
              key={submission.submission_id}
              sx={{ 
                p: 2, 
                mb: 1, 
                border: '1px solid #ddd', 
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
              onClick={() => handleLoadSubmission(submission)}
            >
              <Typography variant="body1">
                Bài nộp #{index + 1} - {new Date(submission.submitted_at).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ngôn ngữ: {submission.language}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trạng thái: {submission.status === 'graded' ? 'Đã chấm' : 
                             submission.status === 'error' ? 'Lỗi' : 'Đang chờ'}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default CodeRunner;
