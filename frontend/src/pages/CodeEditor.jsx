// frontend/src/components/CodeEditor.jsx
import React from 'react';
import { Box } from '@mui/material';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, language, onChange, readOnly = false }) => {
  // Map our language names to Monaco editor language IDs
  const getMonacoLanguage = (lang) => {
    const langMap = {
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'csharp': 'csharp',
      'cpp': 'cpp'
    };
    return langMap[lang] || 'javascript';
  };

  const handleEditorChange = (value) => {
    if (onChange && !readOnly) {
      onChange(value);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Editor
        value={code}
        language={getMonacoLanguage(language)}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          readOnly,
          automaticLayout: true
        }}
      />
    </Box>
  );
};

export default CodeEditor;