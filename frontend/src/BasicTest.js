import React from 'react';

const BasicTest = () => {
  return (
    <div style={{ padding: '20px', fontSize: '24px', textAlign: 'center' }}>
      <h1 style={{ color: 'blue' }}>✅ React is Working!</h1>
      <p>If you can see this message, React is rendering correctly.</p>
      <button 
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button works!')}
      >
        Test Button
      </button>
    </div>
  );
};

export default BasicTest;
