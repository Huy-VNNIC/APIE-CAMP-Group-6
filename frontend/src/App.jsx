import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Keep all your original imports here
// Just adding the live session pages

import LiveSessionsPage from './pages/LiveSessionsPage';
import LiveSessionPage from './pages/LiveSessionPage';

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
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Keep your original routes */}
          
          {/* Live Sessions Routes */}
          <Route path="/live-sessions" element={<LiveSessionsPage />} />
          <Route path="/live-session/:id" element={<LiveSessionPage />} />
          
          {/* Add a default route to your main page */}
          <Route path="*" element={<LiveSessionsPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
