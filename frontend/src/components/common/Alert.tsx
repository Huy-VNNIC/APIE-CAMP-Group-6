import React from 'react';

interface AlertProps {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  let bgColor, textColor, borderColor, iconColor;
  
  switch (type) {
    case 'success':
      bgColor = 'bg-green-50 dark:bg-green-900/20';
      textColor = 'text-green-800 dark:text-green-200';
      borderColor = 'border-green-500';
      iconColor = 'text-green-500';
      break;
    case 'warning':
      bgColor = 'bg-yellow-50 dark:bg-yellow-900/20';
      textColor = 'text-yellow-800 dark:text-yellow-200';
      borderColor = 'border-yellow-500';
      iconColor = 'text-yellow-500';
      break;
    case 'error':
      bgColor = 'bg-red-50 dark:bg-red-900/20';
      textColor = 'text-red-800 dark:text-red-200';
      borderColor = 'border-red-500';
      iconColor = 'text-red-500';
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-50 dark:bg-blue-900/20';
      textColor = 'text-blue-800 dark:text-blue-200';
      borderColor = 'border-blue-500';
      iconColor = 'text-blue-500';
  }
  
  return (
    <div className={`p-4 mb-4 rounded-lg border-l-4 ${bgColor} ${borderColor} flex items-center justify-between`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 mr-3 ${iconColor}`}>
          {type === 'success' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
          )}
          {type === 'info' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
          )}
          {type === 'warning' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
          )}
          {type === 'error' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
          )}
        </div>
        <div className={`${textColor}`}>{message}</div>
      </div>
      {onClose && (
        <button 
          type="button" 
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 ${textColor} hover:bg-white dark:hover:bg-gray-800`}
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;