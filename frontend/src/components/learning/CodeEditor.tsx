import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  readOnly?: boolean;
  onCodeChange?: (code: string) => void;
  onSubmit?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode, 
  language, 
  readOnly = false, 
  onCodeChange,
  onSubmit
}) => {
  const [code, setCode] = useState(initialCode);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState(14);
  const { currentDate, user } = useAuth();
  
  // Placeholder for actual Monaco Editor integration
  // In a real app, we would use Monaco Editor or CodeMirror
  
  useEffect(() => {
    // Simulate editor initialization
    const timer = setTimeout(() => {
      setIsEditorReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };
  
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(code);
    }
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };
  
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
        <div>
          <span className="mr-4">Language: {language}</span>
          <span>Font Size: {fontSize}px</span>
        </div>
        <div>
          <span className="mr-4">Current Date (UTC): {currentDate}</span>
          <span>Login: {user?.login || 'Huy-VNNIC'}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          <button
            onClick={toggleTheme}
            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
          </button>
          <button
            onClick={decreaseFontSize}
            disabled={fontSize <= 10}
            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            A-
          </button>
          <button
            onClick={increaseFontSize}
            disabled={fontSize >= 24}
            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            A+
          </button>
        </div>
        
        {!readOnly && onSubmit && (
          <button
            onClick={handleSubmit}
            className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600"
          >
            Run Code
          </button>
        )}
      </div>
      
      <div className={`flex-1 border rounded-md overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
        {!isEditorReady ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <textarea
            value={code}
            onChange={handleCodeChange}
            readOnly={readOnly}
            style={{ fontSize: `${fontSize}px` }}
            className={`w-full h-full p-4 font-mono resize-none focus:outline-none ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-200' 
                : 'bg-gray-50 text-gray-800'
            }`}
            spellCheck={false}
            placeholder="Write your code here..."
          />
        )}
      </div>
      
      {!readOnly && (
        <div className="mt-4">
          <div className="font-medium mb-2">Output</div>
          <div className={`p-4 border rounded-md font-mono text-sm ${
            theme === 'dark' 
              ? 'bg-gray-900 text-gray-300 border-gray-700' 
              : 'bg-white text-gray-800 border-gray-300'
          }`}>
            {/* Placeholder for code execution output */}
            <p>// Output will appear here after running the code</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;