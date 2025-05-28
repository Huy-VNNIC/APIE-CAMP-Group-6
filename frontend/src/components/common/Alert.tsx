import React from 'react';

interface AlertProps {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  // Define colors based on type
  const getStyles = () => {
    const baseStyle = { 
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };
    
    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: '#d1fae5', // light green
          color: '#065f46', // dark green
          borderLeft: '4px solid #10b981', // medium green
        };
      case 'info':
        return {
          ...baseStyle,
          backgroundColor: '#dbeafe', // light blue
          color: '#1e40af', // dark blue
          borderLeft: '4px solid #3b82f6', // medium blue
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: '#fef3c7', // light yellow
          color: '#92400e', // dark yellow/orange
          borderLeft: '4px solid #f59e0b', // medium yellow/orange
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: '#fee2e2', // light red
          color: '#b91c1c', // dark red
          borderLeft: '4px solid #ef4444', // medium red
        };
      default:
        return baseStyle;
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div style={getStyles()}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '0.75rem' }}>{getIcon()}</span>
        <span>{message}</span>
      </div>
      
      {onClose && (
        <button 
          onClick={onClose}
          style={{ 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            marginLeft: '1rem'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;