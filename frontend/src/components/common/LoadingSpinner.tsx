import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  fullScreen = false,
  message = 'Loading...'
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8 border-2';
      case 'md': return 'h-12 w-12 border-4';
      case 'lg': return 'h-16 w-16 border-4';
      default: return 'h-12 w-12 border-4';
    }
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`${getSpinnerSize()} border-gray-200 dark:border-gray-700 rounded-full border-t-primary-600 dark:border-t-primary-400 animate-spin`}></div>
      {message && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
};

export default LoadingSpinner;