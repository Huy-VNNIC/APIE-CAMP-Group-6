import React, { useState } from 'react';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onSubmit: (code: string) => void;
  submitting: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, language, onSubmit, submitting }) => {
  const [code, setCode] = useState(initialCode);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
      <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center dark:bg-gray-700 dark:border-gray-600">
        <div className="flex items-center">
          <span className="font-medium text-gray-700 dark:text-gray-300">Language:</span>
          <select 
            className="ml-2 bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            value={language}
            disabled
          >
            <option value={language}>{language.charAt(0).toUpperCase() + language.slice(1)}</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            className="py-1 px-3 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            onClick={() => setCode(initialCode)}
          >
            Reset
          </button>
          <button
            type="button"
            className="py-1 px-3 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <textarea
          className="w-full h-80 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
        />
      </div>
      
      <div className="bg-gray-100 px-4 py-3 dark:bg-gray-700">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Tip: Write your code and click "Run Code" to see the output.
        </p>
      </div>
    </div>
  );
};

export default CodeEditor;