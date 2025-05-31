const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: '*',  // Allow all origins
  credentials: true
}));

// Body parser
app.use(express.json());

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../public')));

// Import routes
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const mockOutputRoutes = require('./routes/mockOutputRoutes');

// API test route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api', mockOutputRoutes);

// Create temp directory for code files
const fs = require('fs');
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API health check: http://localhost:${PORT}/api/health`);
  console.log(`Mock API: http://localhost:${PORT}/api/mock-output?id=test&language=javascript`);
});
