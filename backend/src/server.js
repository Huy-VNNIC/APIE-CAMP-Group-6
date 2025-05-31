const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware bảo mật
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // giới hạn mỗi IP 100 requests mỗi 15 phút
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Import routes
const authRoutes = require('./routes/authRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const resourceRoutes = require('./routes/learningResourceRoutes');
const codeSubmissionRoutes = require('./routes/codeSubmissionRoutes');
const quizRoutes = require('./routes/quizRoutes');
const supportTicketRoutes = require('./routes/supportTicketRoutes');
const testRoutes = require('./routes/testRoutes');
app.use('/api/test', testRoutes);
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', enrollmentRoutes);
app.use('/api/learning', resourceRoutes);
app.use('/api/code', codeSubmissionRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/support', supportTicketRoutes);

// Route kiểm tra API
app.get('/', (req, res) => {
  res.json({ 
    message: 'Online Coding Platform API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Route kiểm tra kết nối database
app.get('/api/db-test', async (req, res) => {
  try {
    const db = require('./config/db');
    const result = await db.query('SELECT NOW()');
    const tablesResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    res.json({ 
      message: 'Database connection successful', 
      timestamp: result.rows[0].now,
      tables: tablesResult.rows.map(r => r.table_name)
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.use('/api/code', codeSubmissionRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database: ${process.env.DB_HOST}`);
});
