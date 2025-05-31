import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const PrivateRoute = ({ children, instructorRequired = false }) => {
  const { isAuthenticated, user, loading } = useContext(UserContext);
  
  // While checking authentication status, show nothing
  if (loading) {
    return null;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If route requires instructor role but user is not instructor
  if (instructorRequired && user && user.role !== 'instructor' && user.role !== 'admin') {
    // Redirect to dashboard if they don't have permission
    return <Navigate to="/" />;
  }
  
  // If authenticated (and has required role if needed), render the component
  return children;
};

export default PrivateRoute;
