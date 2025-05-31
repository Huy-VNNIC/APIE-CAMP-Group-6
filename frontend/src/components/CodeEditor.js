import React from 'react';
import Editor from '@monaco-editor/react';
import { Box, CircularProgress } from '@mui/material';

const CodeEditor = ({ value, onChange, language = 'javascript', height = '500px' }) => {
  const handleEditorChange = (newValue) => {
    onChange(newValue);
  };

  const getLanguageId = (lang) => {
    // Monaco Editor language IDs
    switch (lang.toLowerCase()) {
      case 'javascript':
      case 'js':
        return 'javascript';
      case 'typescript':
      case 'ts':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'python':
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'c':
        return 'c';
      case 'cpp':
      case 'c++':
        return 'cpp';
      case 'csharp':
      case 'c#':
        return 'csharp';
      case 'php':
        return 'php';
      case 'ruby':
      case 'rb':
        return 'ruby';
      case 'go':
        return 'go';
      case 'rust':
        return 'rust';
      default:
        return 'plaintext';
    }
  };

  return (
    <Box sx={{ width: '100%', height, border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
      <Editor
        height="100%"
        language={getLanguageId(language)}
        value={value}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
        }}
        loading={<CircularProgress />}
      />
    </Box>
  );
};

export default CodeEditor;