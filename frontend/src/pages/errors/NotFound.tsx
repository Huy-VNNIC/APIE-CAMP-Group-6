import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: 'var(--light)',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '500px',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</div>
        <h1 style={{ fontSize: '2rem', margin: '0 0 1rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
          We couldn't find the page you're looking for. The page may have been moved, deleted, or never existed.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-secondary"
          >
            Go Back
          </button>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
        <p>If you believe this is a mistake, please contact support.</p>
      </div>
    </div>
  );
};

export default NotFound;