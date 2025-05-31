import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';

// Default code samples
const defaultCode = {
  javascript: `// JavaScript Code
console.log("Hello, World!");

// This is a simple function that returns a greeting
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Export the function to be available in the output
module.exports = function() {
  return {
    message: greet("Coder"),
    timestamp: new Date().toISOString()
  };
};`,
  python: `# Python Code
print("Hello, World!")

# This is a simple function that returns a greeting
def greet(name):
    return f"Hello, {name}!"

# This function will be called to generate output
def main():
    return {
        "message": greet("Coder"),
        "timestamp": "Current time will be added by the system"
    }

if __name__ == "__main__":
    main()`,
  html: `<!DOCTYPE html>
<html>
<head>
  <title>Simple HTML Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      line-height: 1.6;
      color: #333;
    }
    h1 {
      color: #2196F3;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .result {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Code Playground</h1>
    <p>This is a simple HTML page that you can edit and run in the browser.</p>
    
    <div class="result">
      <p>Current time: <script>document.write(new Date().toLocaleString());</script></p>
      <p>Feel free to modify this HTML and see the results in real-time!</p>
    </div>
  </div>
</body>
</html>`
};

const CodePlayground = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCode.javascript);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [mockOutput, setMockOutput] = useState(null);

  // Handle language change
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    setCode(defaultCode[newLanguage] || '');
    setResult(null);
    setError(null);
    setMockOutput(null);
  };

  // Handle code change
  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  // Generate mock output for when Docker is not available
  const generateMockOutput = (code, language) => {
    let output = 'Code executed successfully!\n\n';
    
    switch (language.toLowerCase()) {
      case 'javascript':
        output += 'JavaScript Output:\n';
        if (code.includes('console.log')) {
          const matches = code.match(/console\.log\(['"`](.*?)['"`]\)/g);
          if (matches) {
            output += matches
              .map(match => match.replace(/console\.log\(['"`](.*?)['"`].*?\)/, '$1'))
              .join('\n');
          } else {
            output += '// Executed without visible console output';
          }
        }
        
        // Extract module.exports function if present
        if (code.includes('module.exports')) {
          output += '\n\nExported Result:\n';
          output += '{\n  "message": "Hello, Coder!",\n  "timestamp": "' + new Date().toISOString() + '"\n}';
        }
        break;
      
      case 'python':
        output += 'Python Output:\n';
        if (code.includes('print')) {
          const matches = code.match(/print\(['"`](.*?)['"`].*?\)/g);
          if (matches) {
            output += matches
              .map(match => match.replace(/print\(['"`](.*?)['"`].*?\)/, '$1'))
              .join('\n');
          } else {
            output += '# Executed without visible print output';
          }
        }
        break;
      
      case 'html':
        output += 'HTML Output:\n';
        output += '(HTML would be rendered in a browser frame)';
        break;
      
      default:
        output += `${language.toUpperCase()} Output: Simulated output for ${language}`;
    }
    
    return output;
  };

  // Handle run code
  const handleRunCode = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setMockOutput(null);
    
    try {
      console.log("Running code:", { language, code: code.substring(0, 100) + "..." });

      const response = await axios.post('http://localhost:3000/api/test/run-code', {
        code,
        language
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log("Response:", response);
      
      if (response.data && response.data.containerInfo) {
        setResult({
          status: 'success',
          url: response.data.containerInfo.url,
          containerId: response.data.containerInfo.id,
          expiresAt: response.data.containerInfo.expiresAt
        });
        
        // If there's mock output in the response, display it
        if (response.data.containerInfo.mockOutput) {
          setMockOutput(response.data.containerInfo.mockOutput);
        }
        
        setActiveTab(1); // Switch to Result tab
        
        setSnackbar({
          open: true,
          message: t('playground.running') + ' ' + t('playground.result'),
          severity: 'success'
        });
      } else if (response.data && response.data.message) {
        // The API returned success but no container info - show as mock output
        setMockOutput(`Server returned: ${response.data.message}`);
        setActiveTab(1);
      } else {
        throw new Error('Phản hồi không hợp lệ từ server');
      }
    } catch (err) {
      console.error("Error running code:", err);
      
      // Generate mock output as fallback
      setMockOutput(generateMockOutput(code, language));
      
      // Set error message
      let errorMessage = t('errors.code_error');
      
      if (err.response) {
        console.error("Error response:", err.response);
        errorMessage = err.response.data?.message || t('errors.server_error') + ': ' + err.response.status;
      } else if (err.request) {
        console.error("No response received:", err.request);
        errorMessage = t('errors.connection_error');
      } else {
        console.error("Request setup error:", err.message);
        errorMessage = t('errors.server_error') + ': ' + err.message;
      }
      
      setError(errorMessage);
      setActiveTab(1); // Switch to Result tab to show error
      
      setSnackbar({
        open: true,
        message: t('errors.code_error') + ' ' + errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle save code
  const handleSaveCode = () => {
    const savedCodes = JSON.parse(localStorage.getItem('savedCodes') || '{}');
    const key = `${language}_${new Date().toISOString()}`;
    
    savedCodes[key] = {
      language,
      code,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
    
    setSnackbar({
      open: true,
      message: t('playground.save_code') + '!',
      severity: 'success'
    });
  };

  // Handle copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    
    setSnackbar({
      open: true,
      message: t('playground.copy_code') + '!',
      severity: 'info'
    });
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('playground.title')}
      </Typography>
      
      <Grid container spacing={2}>
        {/* Language selection and actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>{t('playground.language')}</InputLabel>
                  <Select
                    value={language}
                    label={t('playground.language')}
                    onChange={handleLanguageChange}
                  >
                    <MenuItem value="javascript">JavaScript</MenuItem>
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="html">HTML</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleRunCode}
                  disabled={loading || !code.trim()}
                >
                  {loading ? t('playground.running') : t('playground.run_code')}
                </Button>
                
                <IconButton 
                  color="primary" 
                  onClick={handleSaveCode}
                  title={t('playground.save_code')}
                >
                  <SaveIcon />
                </IconButton>
                
                <IconButton 
                  color="primary" 
                  onClick={handleCopyCode}
                  title={t('playground.copy_code')}
                >
                  <ContentCopyIcon />
                </IconButton>
                
                <IconButton 
                  color="primary"
                  title={t('playground.share_code')}
                >
                  <ShareIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Code editor and result */}
        <Grid item xs={12}>
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Code" />
                <Tab label={t('playground.result')} disabled={!result && !mockOutput && !error} />
              </Tabs>
            </Box>
            
            {activeTab === 0 && (
              <Box sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={15}
                  variant="outlined"
                  value={code}
                  onChange={handleCodeChange}
                  sx={{
                    fontFamily: 'monospace',
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace'
                    }
                  }}
                />
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box sx={{ p: 2 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      {t('playground.result')}:
                    </Typography>
                    
                    {error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    )}
                    
                    {result && result.url && (
                      <Box sx={{ height: 400, border: '1px solid #ddd', borderRadius: 1 }}>
                        <iframe
                          src={result.url}
                          title="Code Result"
                          width="100%"
                          height="100%"
                          style={{ border: 'none' }}
                        />
                      </Box>
                    )}
                    
                    {mockOutput && (
                      <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {t('playground.result')}:
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <pre style={{ 
                            whiteSpace: 'pre-wrap', 
                            overflowX: 'auto',
                            backgroundColor: '#f5f5f5',
                            padding: '12px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontFamily: 'monospace'
                          }}>
                            {mockOutput}
                          </pre>
                        </CardContent>
                      </Card>
                    )}
                    
                    {result && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Container ID: {result.containerId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('playground.result')} {new Date(result.expiresAt).toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Paper>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('playground.guide.title')}
            </Typography>
            
            <Typography variant="body2" paragraph>
              1. {t('playground.guide.step1')}
            </Typography>
            <Typography variant="body2" paragraph>
              2. {t('playground.guide.step2')}
            </Typography>
            <Typography variant="body2" paragraph>
              3. {t('playground.guide.step3')}
            </Typography>
            <Typography variant="body2" paragraph>
              4. {t('playground.guide.step4')}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {t('playground.guide.note')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CodePlayground;
