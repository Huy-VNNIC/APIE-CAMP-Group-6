import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResourcesList from './pages/resources/ResourcesList';
import ResourceDetail from './pages/resources/ResourceDetail';
import UserProgress from './pages/progress/UserProgress';
import ProfileSettings from './pages/profile/ProfileSettings';
import RecentActivities from './pages/activities/RecentActivities';
import NotFound from './pages/errors/NotFound';
import MainLayout from './layouts/MainLayout';
import useAuth from './hooks/useAuth';
import './styles/clean.css';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/resources" element={
          <PrivateRoute>
            <MainLayout>
              <ResourcesList />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/resources/:id" element={
          <PrivateRoute>
            <MainLayout>
              <ResourceDetail />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/progress" element={
          <PrivateRoute>
            <MainLayout>
              <UserProgress />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <MainLayout>
              <ProfileSettings />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/activities" element={
          <PrivateRoute>
            <MainLayout>
              <RecentActivities />
            </MainLayout>
          </PrivateRoute>
        } />
        
        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;