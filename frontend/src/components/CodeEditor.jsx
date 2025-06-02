import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';

// Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import FormatPainterIcon from '@mui/icons-material/FormatPainter';
import HistoryIcon from '@mui/icons-material/History';

const CodeEditor = ({ readOnly = false }) => {
  const [code, setCode] = useState('// Start coding here...');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [codeHistory, setCodeHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' }
  ];
  
  const codeTemplates = {
    javascript: '// JavaScript Example\nconsole.log("Hello, World!");\n\n// Define a function\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Call the function\nconsole.log(greet("Student"));',
    python: '# Python Example\nprint("Hello, World!")\n\n# Define a function\ndef greet(name):\n    return f"Hello, {name}!"\n\n# Call the function\nprint(greet("Student"))',
    java: '// Java Example\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println(greet("Student"));\n    }\n    \n    public static String greet(String name) {\n        return "Hello, " + name + "!";\n    }\n}',
    cpp: '// C++ Example\n#include <iostream>\n#include <string>\n\nstd::string greet(std::string name) {\n    return "Hello, " + name + "!";\n}\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    std::cout << greet("Student") << std::endl;\n    return 0;\n}',
    ruby: '# Ruby Example\nputs "Hello, World!"\n\n# Define a function\ndef greet(name)\n  "Hello, #{name}!"\nend\n\n# Call the function\nputs greet("Student")',
    go: '// Go Example\npackage main\n\nimport "fmt"\n\nfunc greet(name string) string {\n    return fmt.Sprintf("Hello, %s!", name)\n}\n\nfunc main() {\n    fmt.Println("Hello, World!")\n    fmt.Println(greet("Student"))\n}'
  };
  
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    // Save current code to history
    setCodeHistory(prev => [...prev, { code, language, timestamp: new Date().toISOString() }]);
    
    // Simulate code execution with language-specific outputs
    setTimeout(() => {
      let result;
      
      switch(language) {
        case 'javascript':
          result = 'Hello, World!\nHello, Student!\n\n> Process exited with code 0';
          break;
        case 'python':
          result = 'Hello, World!\nHello, Student!\n\n>>> Process finished (0.054 seconds)';
          break;
        case 'java':
          result = 'Hello, World!\nHello, Student!\n\nProcess finished with exit code 0';
          break;
        case 'cpp':
          result = 'Hello, World!\nHello, Student!\n\n[Process completed - press Enter]';
          break;
        case 'ruby':
          result = 'Hello, World!\nHello, Student!\n\n=> nil';
          break;
        case 'go':
          result = 'Hello, World!\nHello, Student!\n\nProgram exited.';
          break;
        default:
          result = 'Hello, World!\nHello, Student!';
      }
      
      setOutput(result);
      setIsRunning(false);
    }, 1500);
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(
      () => {
        setSnackbar({ 
          open: true, 
          message: 'Code copied to clipboard!', 
          severity: 'success' 
        });
      },
      () => {
        setSnackbar({ 
          open: true, 
          message: 'Failed to copy code', 
          severity: 'error' 
        });
      }
    );
  };
  
  const handleSaveCode = () => {
    // In a real app, this would save to server or download the file
    // For demo, we'll just show a success message
    setSnackbar({ 
      open: true, 
      message: 'Code saved successfully!', 
      severity: 'success' 
    });
  };
  
  const handleFormatCode = () => {
    // In a real app, this would properly format the code based on language
    // For demo, we'll just show a success message
    setSnackbar({ 
      open: true, 
      message: 'Code formatted!', 
      severity: 'success' 
    });
  };
  
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Ask if user wants to load a template for the new language
    if (window.confirm(`Would you like to load a ${languageOptions.find(l => l.value === newLanguage).label} template?`)) {
      setCode(codeTemplates[newLanguage]);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const handleShowHistory = () => {
    if (codeHistory.length === 0) {
      setSnackbar({ 
        open: true, 
        message: 'No code history available', 
        severity: 'info' 
      });
      return;
    }
    
    // In a real app, this would show a modal with code history
    // For demo, we'll just load the most recent code
    const lastCode = codeHistory[codeHistory.length - 1];
    if (window.confirm('Load previous version of your code?')) {
      setCode(lastCode.code);
      setLanguage(lastCode.language);
    }
  };
  
  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Code Editor
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              onChange={handleLanguageChange}
              label="Language"
              disabled={readOnly}
            >
              {languageOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Tooltip title="Copy Code">
            <IconButton onClick={handleCopyCode}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Save Code">
            <IconButton onClick={handleSaveCode} disabled={readOnly}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Format Code">
            <IconButton onClick={handleFormatCode} disabled={readOnly}>
              <FormatPainterIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Code History">
            <IconButton onClick={handleShowHistory} disabled={codeHistory.length === 0}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PlayArrowIcon />}
            onClick={handleRunCode}
            disabled={isRunning || readOnly}
          >
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </Box>
      </Box>
      
      <TextField
        fullWidth
        multiline
        rows={15}
        variant="outlined"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ fontFamily: 'monospace', mb: 2 }}
        disabled={readOnly}
        placeholder="Write your code here..."
      />
      
      <Typography variant="h6" gutterBottom>
        Output
      </Typography>
      
      <Paper sx={{ 
        p: 2, 
        bgcolor: 'black', 
        color: 'white', 
        borderRadius: 1,
        fontFamily: 'monospace',
        height: '200px',
        overflow: 'auto'
      }}>
        <pre>{output || 'Run your code to see output here'}</pre>
      </Paper>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CodeEditor;
