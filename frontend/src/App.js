import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { UserProvider } from './contexts/UserContext';
import theme from './theme';

// Layout và Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
// import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CodePlayground from './pages/CodePlayground';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AssignmentList from './pages/AssignmentList';
import AssignmentDetail from './pages/AssignmentDetail';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            
            {/* Private Routes */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/playground" 
              element={
                <PrivateRoute>
                  <Layout>
                    <CodePlayground />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/courses" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Courses />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/courses/:id" 
              element={
                <PrivateRoute>
                  <Layout>
                    <CourseDetails />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/assignments" 
              element={
                <PrivateRoute>
                  <Layout>
                    <AssignmentList />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/assignments/:id" 
              element={
                <PrivateRoute>
                  <Layout>
                    <AssignmentDetail />
                  </Layout>
                </PrivateRoute>
              } 
            />
            
            {/* Not Found Route */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
