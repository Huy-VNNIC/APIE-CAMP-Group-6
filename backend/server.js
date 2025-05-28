const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3005;

// Database Configuration
const dbConfig = {
  host: '202.249.25.211',
  port: 3306,
  user: 'sa',
  password: 'huy',
  database: 'online_coding_platform'
};

// Create a pool connection
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      dbConnection: 'connected',
      message: 'API server is running with database connection'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      dbConnection: 'failed',
      error: error.message,
      message: 'API server is running but database connection failed'
    });
  }
});

// === AUTH ROUTES ===
// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email và mật khẩu là bắt buộc' });
    }
    
    const [users] = await pool.execute(
      'SELECT id, name, email, password_hash, role, verified, created_at FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Thông tin đăng nhập không chính xác' });
    }
    
    const user = users[0];
    
    // For now, use a simple password check
    // In production, use bcrypt.compare
    const passwordIsValid = user.password_hash === `hashed_password_${user.id}`;
    
    if (!passwordIsValid) {
      return res.status(401).json({ success: false, message: 'Thông tin đăng nhập không chính xác' });
    }
    
    // Don't send password in response
    const { password_hash, ...userWithoutPassword } = user;
    
    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          ...userWithoutPassword,
          verified: user.verified === 1
        },
        token: `token-${user.id}-${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng nhập',
      error: error.message
    });
  }
});

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role = 'student' } = req.body;
  
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Tên, email và mật khẩu là bắt buộc' });
    }
    
    // Check if email exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: 'Email đã được sử dụng' });
    }
    
    // For now, use a simple password hash
    // In production, use bcrypt.hash
    const passwordHash = `hashed_password_new`;
    
    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role, verified) VALUES (?, ?, ?, ?, ?)',
      [name, email, passwordHash, role, 0] // 0 = not verified
    );
    
    const userId = result.insertId;
    
    // If student, create student record
    if (role === 'student') {
      const dashboardData = JSON.stringify({
        progress: 0,
        current_course: null,
        completed_courses: []
      });
      
      await pool.execute(
        'INSERT INTO students (user_id, dashboard_data) VALUES (?, ?)',
        [userId, dashboardData]
      );
    }
    
    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: userId,
          name,
          email,
          role,
          verified: 0
        },
        token: `token-${userId}-${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng ký',
      error: error.message
    });
  }
});

// Get current user endpoint
app.get('/api/auth/me', async (req, res) => {
  // In a real app, extract userId from JWT token
  // For demo, just use a fixed ID
  const userId = 1;
  
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, verified, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const user = users[0];
    
    return res.json({
      success: true,
      data: {
        user: {
          ...user,
          verified: user.verified === 1
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// === STUDENT ROUTES ===
// Get student dashboard
app.get('/api/student/dashboard', async (req, res) => {
  // In a real app, extract userId from JWT token
  // For demo, just use a fixed ID
  const userId = 1;
  
  try {
    // Get user data
    const [users] = await pool.execute(
      'SELECT id, name, email, role, verified FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get student data
    const [students] = await pool.execute(
      'SELECT * FROM students WHERE user_id = ?',
      [userId]
    );
    
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    // Parse dashboard_data
    let dashboardData = {};
    try {
      if (typeof students[0].dashboard_data === 'string') {
        dashboardData = JSON.parse(students[0].dashboard_data);
      } else {
        dashboardData = students[0].dashboard_data;
      }
    } catch (e) {
      console.error('Error parsing dashboard_data:', e);
    }
    
    return res.json({
      success: true,
      data: {
        student: {
          id: users[0].id,
          name: users[0].name,
          email: users[0].email,
          verified: users[0].verified === 1
        },
        dashboardData: {
          ...dashboardData,
          points: 1250,
          level: 5,
          completed_resources: 12,
          badges: ["Fast Learner", "Code Ninja", "Algorithm Master"]
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Get student profile
app.get('/api/student/profile', async (req, res) => {
  // In a real app, extract userId from JWT token
  // For demo, just use a fixed ID
  const userId = 1;
  
  try {
    // Get user and student data with JOIN
    const [profiles] = await pool.execute(`
      SELECT u.id, u.name, u.email, u.role, u.verified, s.dashboard_data
      FROM users u
      JOIN students s ON u.id = s.user_id
      WHERE u.id = ?
    `, [userId]);
    
    if (profiles.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    
    // Parse dashboard_data
    let dashboardData = {};
    try {
      if (typeof profiles[0].dashboard_data === 'string') {
        dashboardData = JSON.parse(profiles[0].dashboard_data);
      } else {
        dashboardData = profiles[0].dashboard_data;
      }
    } catch (e) {
      console.error('Error parsing dashboard_data:', e);
    }
    
    // Add preferences
    const preferences = {
      theme: 'dark',
      editor_font_size: 14,
      editor_tab_size: 2,
      auto_save: true
    };
    
    return res.json({
      success: true,
      data: {
        user_id: profiles[0].id,
        name: profiles[0].name,
        email: profiles[0].email,
        verified: profiles[0].verified === 1,
        dashboard_data: {
          ...dashboardData,
          preferences
        }
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Test DB endpoint
app.get('/api/test-db/check', async (req, res) => {
  try {
    console.log('Testing database connection...');
    
    // Test students table
    const [students] = await pool.execute('SELECT * FROM students');
    console.log(`Found ${students.length} students in database`);
    
    // Test join with users
    const [studentUsers] = await pool.execute(`
      SELECT u.*, s.* 
      FROM users u 
      JOIN students s ON u.id = s.user_id 
      WHERE u.role = 'student'
    `);
    
    console.log(`Found ${studentUsers.length} student users with join query`);
    
    res.json({
      success: true,
      message: 'Database connection successful',
      data: {
        students,
        studentUsers,
        studentCount: students.length,
        studentUserCount: studentUsers.length
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Default API route
app.get('/api', (req, res) => {
  res.json({
    name: 'Online Coding Platform API',
    version: '1.0.0',
    endpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/me',
      '/api/student/dashboard',
      '/api/student/profile',
      '/api/test-db/check',
      '/api/health'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}/api`);
});

module.exports = app;