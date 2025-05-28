import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Resources from './pages/learning/Resources';
import ResourceDetail from './pages/learning/ResourceDetail';
import Profile from './pages/profile/Profile';
import Tickets from './pages/support/Tickets';
import TicketDetail from './pages/support/TicketDetail';
import CreateTicket from './pages/support/CreateTicket';
import PrivateRoute from './components/auth/PrivateRoute';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/learning/resources" element={<PrivateRoute element={<Resources />} />} />
        <Route path="/learning/resources/:id" element={<PrivateRoute element={<ResourceDetail />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/support/tickets" element={<PrivateRoute element={<Tickets />} />} />
        <Route path="/support/tickets/:id" element={<PrivateRoute element={<TicketDetail />} />} />
        <Route path="/support/create-ticket" element={<PrivateRoute element={<CreateTicket />} />} />
        
        {/* Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;