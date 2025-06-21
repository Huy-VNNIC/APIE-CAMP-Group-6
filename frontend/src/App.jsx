import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Keep all your original imports here
// Adding session pages
import LiveSessionsPage from './pages/LiveSessionsPage';
import LiveSessionPage from './pages/LiveSessionPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentNotifications from './pages/StudentNotifications';
import StudentAnalytics from './pages/StudentAnalytics';
import StudentCollaboration from './pages/StudentCollaboration';

// Marketing Pages
import MarketingDashboard from './pages/marketing/MarketingDashboard';

// Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    }
  },
});

function App() {
  const [user, setUser] = useState(null);
  
  // Simulate user authentication
  useEffect(() => {
    // In a real app, this would be an authentication check
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      // For demonstration, set a default student user
      const demoUser = {
        id: '123',
        name: 'Demo Student',
        role: 'student'
      };
      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
    }
  }, []);
  
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <Routes>
            {/* Keep your original routes */}
            
            {/* Live Sessions Routes */}
            <Route path="/live-sessions" element={<LiveSessionsPage />} />
            <Route path="/live-session/:id" element={<LiveSessionPage />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/notifications" element={<StudentNotifications />} />
            <Route path="/student/analytics" element={<StudentAnalytics />} />
            <Route path="/student/collaboration" element={<StudentCollaboration />} />
            
            {/* Marketing Routes */}
            <Route path="/marketing" element={<MarketingDashboard />} />
            <Route path="/marketing/campaigns" element={<Navigate to="/marketing" />} />
            <Route path="/marketing/promotional-content" element={<Navigate to="/marketing" />} />
            <Route path="/marketing/partnerships" element={<Navigate to="/marketing" />} />
            <Route path="/marketing/metrics" element={<Navigate to="/marketing" />} />
            
            {/* Add default route based on user role */}
            <Route 
              path="/" 
              element={
                user?.role === 'student' 
                  ? <Navigate to="/student/dashboard" /> 
                  : user?.role === 'marketing'
                  ? <Navigate to="/marketing" />
                  : <Navigate to="/live-sessions" />
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
