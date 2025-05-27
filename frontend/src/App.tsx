import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Page components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ResourcesList from './pages/learning/Resources';
import ResourceDetail from './pages/learning/ResourceDetail';
import Profile from './pages/profile/Profile';
import CreateTicket from './pages/support/CreateTicket';
import Tickets from './pages/support/Tickets';

// Auth guard
import { ProtectedRoute } from './utils/ProtectedRoute';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/learning/resources" element={
              <ProtectedRoute>
                <ResourcesList />
              </ProtectedRoute>
            } />
            
            <Route path="/learning/resources/:id" element={
              <ProtectedRoute>
                <ResourceDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/support/tickets" element={
              <ProtectedRoute>
                <Tickets />
              </ProtectedRoute>
            } />
            
            <Route path="/support/create-ticket" element={
              <ProtectedRoute>
                <CreateTicket />
              </ProtectedRoute>
            } />
            
            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;