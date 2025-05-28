import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium' }) => {
  const getSize = () => {
    switch (size) {
      case 'small': return '1.5rem';
      case 'large': return '3rem';
      default: return '2rem';
    }
  };

  return (
    <div 
      className="loader" 
      style={{
        width: getSize(),
        height: getSize(),
        border: '4px solid var(--gray-200)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }}
    ></div>
  );
};

export default Loader;