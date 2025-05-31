import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(UserContext);
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render children if authenticated
  return children;
};

export default PrivateRoute;
