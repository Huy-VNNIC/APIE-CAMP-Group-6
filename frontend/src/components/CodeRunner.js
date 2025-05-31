import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CodeEditor from './CodeEditor';
import { UserContext } from '../contexts/UserContext';

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'php', label: 'PHP' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
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
`,
  
  java: `// Java Code Template
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`,

  ruby: `# Ruby Code Template
puts "Hello from Ruby!"

def hello(name)
  "Hello, #{name}!"
end

puts hello("World")`,

  go: `// Go Code Template
package main

import (
    "fmt"
)

func main() {
    fmt.Println("Hello from Go!")
}`,

  css: `/* CSS Code Template */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

h1 {
  color: #2196f3;
  text-align: center;
}

p {
  line-height: 1.6;
  margin-bottom: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
`
};

const CodeRunner = ({ resourceId = null, courseId = null, submissionId = null }) => {
  const { token } = useContext(UserContext);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [previousSubmissions, setPreviousSubmissions] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    // Nếu có submissionId, lấy thông tin submission
    if (submissionId) {
      fetchSubmission();
    } else {
      // Nếu không, đặt code template dựa vào ngôn ngữ
      setCode(templates[language] || '');
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
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const filteredSubmissions = response.data.submissions.filter(sub => 
        sub.resource_id == resourceId && sub.course_id == courseId
      );
      
      setPreviousSubmissions(filteredSubmissions);
    } catch (err) {
      console.error('Error fetching previous submissions:', err);
    }
  };
  
  const handleRunCode = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Thay đổi endpoint từ /api/code/run thành /api/test/run-code
      const response = await axios.post('/api/test/run-code', {
        code: code,
        language: language
      });
      
      console.log("Response:", response.data);
      
      setResult({
        status: 'success',
        url: response.data.containerInfo.url,
        containerId: response.data.containerInfo.id,
        expiresAt: response.data.containerInfo.expiresAt
      });
      
      setActiveTab(1); // Switch to Result tab
      setLoading(false);
      
      setSnackbar({
        open: true,
        message: 'Code đã được chạy thành công!',
        severity: 'success'
      });
    } catch (err) {
      console.error("Error running code:", err);
      setError(err.response?.data?.message || 'Lỗi khi chạy code');
      setLoading(false);
      
      setSnackbar({
        open: true,
        message: 'Lỗi khi chạy code!',
        severity: 'error'
      });
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
        headers: { Authorization: `Bearer ${token}` }
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
      
      setSnackbar({
        open: true,
        message: 'Nộp bài thành công!',
        severity: 'success'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi nộp code');
      setLoading(false);
      
      setSnackbar({
        open: true,
        message: 'Lỗi khi nộp bài!',
        severity: 'error'
      });
    }
  };
  
  const handleExtendContainer = async () => {
    if (!submissionId || !result?.containerId) return;
    
    try {
      setLoading(true);
      
      const response = await axios.post(`/api/code/submissions/${submissionId}/extend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setResult(prev => ({
        ...prev,
        expiresAt: response.data.expiresAt
      }));
      
      setLoading(false);
      
      setSnackbar({
        open: true,
        message: 'Đã gia hạn thời gian container!',
        severity: 'success'
      });
    } catch (err) {
      setError('Không thể gia hạn container');
      setLoading(false);
      
      setSnackbar({
        open: true,
        message: 'Không thể gia hạn container!',
        severity: 'error'
      });
    }
  };
  
  const handleRerunCode = async () => {
    if (!submissionId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`/api/code/submissions/${submissionId}/rerun`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setResult(response.data.result);
      setActiveTab(1); // Switch to Result tab
      setLoading(false);
      
      setSnackbar({
        open: true,
        message: 'Đã chạy lại code thành công!',
        severity: 'success'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi chạy lại code');
      setLoading(false);
      
      setSnackbar({
        open: true,
        message: 'Lỗi khi chạy lại code!',
        severity: 'error'
      });
    }
  };
  
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    
    // Nếu không phải đang xem submission, đặt lại template
    if (!submissionId) {
      setCode(templates[newLanguage] || '');
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
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Code Runner</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="language-select-label">Ngôn ngữ</InputLabel>
          <Select
            labelId="language-select-label"
            value={language}
            label="Ngôn ngữ"
            onChange={handleLanguageChange}
          >
            {languageOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)} 
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
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
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={handleRunCode}
              disabled={loading || !code}
            >
              {loading ? <CircularProgress size={24} /> : 'Chạy code'}
            </Button>
            
            {resourceId && courseId && (
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<SaveIcon />}
                onClick={handleSubmitCode}
                disabled={loading || !code}
              >
                {loading ? <CircularProgress size={24} /> : 'Nộp bài'}
              </Button>
            )}
            
            {submissionId && (
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                onClick={handleRerunCode}
                disabled={loading}
              >
                Chạy lại code
              </Button>
            )}
          </Box>
        </Box>
      )}
      
      {activeTab === 1 && (
        <Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : result && result.url ? (
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Thời gian còn lại: {calculateTimeLeft(result.expiresAt)}
                    </Typography>
                  </Box>
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
            <Paper 
              key={submission.submission_id}
              sx={{ 
                p: 2, 
                mb: 2, 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.03)' }
              }}
              onClick={() => handleLoadSubmission(submission)}
            >
              <Typography variant="subtitle2">
                Bài nộp #{index + 1} - {new Date(submission.submitted_at).toLocaleString()}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Ngôn ngữ: {submission.language}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Trạng thái: {
                    submission.status === 'graded' ? 'Đã chấm' : 
                    submission.status === 'error' ? 'Lỗi' : 'Đang chờ'
                  }
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CodeRunner;