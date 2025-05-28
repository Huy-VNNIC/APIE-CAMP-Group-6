const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken'); // Thêm thư viện JWT

const app = express();
const PORT = process.env.PORT || 3005;
const JWT_SECRET = 'your_jwt_secret_key'; // Thêm secret key cho JWT

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

// Helper function to execute queries
const query = async (sql, params) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Auth middleware
const auth = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }
  
  try {
    // For demo purposes (without JWT)
    if (token.startsWith('token-')) {
      const userId = parseInt(token.split('-')[1]);
      req.user = { id: userId };
      return next();
    }
    
    // Verify token with JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

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
    
    const users = await query(
      'SELECT id, name, email, password_hash, role, verified, created_at FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Thông tin đăng nhập không chính xác' });
    }
    
    const user = users[0];
    
    // For now, use a simple password check
    // In production, use bcrypt.compare
    const passwordIsValid = password === 'password123' || user.password_hash === `hashed_password_${user.id}`;
    
    if (!passwordIsValid) {
      return res.status(401).json({ success: false, message: 'Thông tin đăng nhập không chính xác' });
    }
    
    // Generate JWT token
    const token = `token-${user.id}-${Date.now()}`; // In production, use: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    
    // Don't send password in response
    const { password_hash, ...userWithoutPassword } = user;
    
    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        ...userWithoutPassword,
        verified: user.verified === 1,
        login: 'Huy-VNNIC'  // Thêm login field mà frontend đang sử dụng
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
    const existingUsers = await query(
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
    const result = await query(
      'INSERT INTO users (name, email, password_hash, role, verified) VALUES (?, ?, ?, ?, ?)',
      [name, email, passwordHash, role, 0] // 0 = not verified
    );
    
    const userId = result.insertId;
    
    // If student, create student record
    if (role === 'student') {
      const dashboardData = JSON.stringify({
        progress: 0,
        level: 1,
        points: 0,
        completed_resources: 0
      });
      
      await query(
        'INSERT INTO students (user_id, dashboard_data) VALUES (?, ?)',
        [userId, dashboardData]
      );
    }
    
    // Generate JWT token
    const token = `token-${userId}-${Date.now()}`; // In production, use: jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
    
    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      user: {
        id: userId,
        name,
        email,
        role,
        verified: 0,
        login: 'Huy-VNNIC'  // Thêm login field mà frontend đang sử dụng
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

// Get current user endpoint - FIX: Cập nhật để khớp với frontend gọi /api/auth/user
app.get('/api/auth/user', auth, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, name, email, role, verified, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const user = users[0];
    
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified === 1,
      login: 'Huy-VNNIC', // Thêm login field mà frontend đang sử dụng
      created_at: user.created_at
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

// Sửa lại route /api/auth/me để tương thích với frontend
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, name, email, role, verified, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const user = users[0];
    
    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified === 1,
          login: 'Huy-VNNIC', // Thêm login field mà frontend đang sử dụng
          created_at: user.created_at
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
app.get('/api/student/dashboard', auth, async (req, res) => {
  try {
    // Get user data
    const users = await query(
      'SELECT id, name, email, role, verified FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get student data
    const students = await query(
      'SELECT * FROM students WHERE user_id = ?',
      [req.user.id]
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
    
    // Mô phỏng dữ liệu khóa học và hoạt động
    const enrolledCourses = [
      {
        id: 1,
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        progress: 80,
        last_accessed: '2025-05-25 10:30:00'
      },
      {
        id: 2,
        title: 'React for Beginners',
        description: 'Introduction to React library and its concepts',
        progress: 45,
        last_accessed: '2025-05-26 14:15:00'
      },
      {
        id: 3,
        title: 'Advanced CSS & Sass',
        description: 'Master modern CSS techniques and Sass',
        progress: 30,
        last_accessed: '2025-05-24 09:20:00'
      }
    ];
    
    const recentActivities = [
      {
        id: 1,
        type: 'course_progress',
        description: 'Completed "Variables and Data Types" in JavaScript Fundamentals',
        timestamp: '2025-05-26 15:30:00'
      },
      {
        id: 2,
        type: 'assignment_submission',
        description: 'Submitted "CSS Layout Challenge" in Advanced CSS & Sass',
        timestamp: '2025-05-25 11:45:00'
      },
      {
        id: 3,
        type: 'course_progress',
        description: 'Started "React Hooks" in React for Beginners',
        timestamp: '2025-05-24 14:20:00'
      }
    ];
    
    const upcomingAssignments = [
      {
        id: 1,
        title: 'JavaScript Project',
        course_title: 'JavaScript Fundamentals',
        due_date: '2025-06-01 23:59:59'
      },
      {
        id: 2,
        title: 'React Component Challenge',
        course_title: 'React for Beginners',
        due_date: '2025-06-05 23:59:59'
      }
    ];
    
    return res.json({
      success: true,
      data: {
        dashboardData: {
          ...dashboardData,
        },
        enrolledCourses,
        recentActivities,
        upcomingAssignments
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
app.get('/api/student/profile', auth, async (req, res) => {
  try {
    // Get user and student data with JOIN
    const profiles = await query(`
      SELECT u.id, u.name, u.email, u.role, u.verified, s.dashboard_data
      FROM users u
      JOIN students s ON u.id = s.user_id
      WHERE u.id = ?
    `, [req.user.id]);
    
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
        login: 'Huy-VNNIC', // Thêm login field mà frontend đang sử dụng
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

// === LEARNING RESOURCES ROUTES ===
// Get all resources
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await query(`
      SELECT * FROM learning_resources
      ORDER BY created_at DESC
    `);
    
    // Thêm thẻ tags cho resources
    const resourcesWithTags = resources.map(resource => ({
      ...resource,
      tags: ['javascript', 'web development', 'programming']
    }));
    
    return res.json({
      success: true,
      data: resourcesWithTags
    });
  } catch (error) {
    console.error('Get resources error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Get resource by ID
app.get('/api/resources/:id', async (req, res) => {
  try {
    const resourceId = req.params.id;
    const resources = await query('SELECT * FROM learning_resources WHERE id = ?', [resourceId]);
    
    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    const resource = resources[0];
    
    // Thêm tags và author
    resource.tags = ['javascript', 'web development', 'programming'];
    resource.author = 'Alice Johnson';
    
    return res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Get resource detail error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// === CODE EXECUTION ROUTES ===
// Run code
app.post('/api/execution/run', auth, async (req, res) => {
  try {
    const { code, language, resourceId } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        msg: 'Code and language are required'
      });
    }
    
    // Mô phỏng kết quả thực thi code
    const result = {
      success: true,
      output: `Running ${language} code...\nOutput: Hello, World!\nExecution time: 0.05s`,
      error: null
    };
    
    // Lưu submission nếu có resourceId
    if (resourceId) {
      await query(
        `INSERT INTO student_submissions (student_id, resource_id, code, result, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, resourceId, code, JSON.stringify(result), 'success']
      );
    }
    
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Code execution error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Get submission history
app.get('/api/execution/history/:resourceId', auth, async (req, res) => {
  try {
    const resourceId = req.params.resourceId;
    
    const submissions = await query(
      `SELECT id, code, result, status, submitted_at 
       FROM student_submissions 
       WHERE student_id = ? AND resource_id = ? 
       ORDER BY submitted_at DESC`,
      [req.user.id, resourceId]
    );
    
    return res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Get submission history error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// === PROGRESS TRACKING ROUTES ===
// Get overall progress
app.get('/api/progress', auth, async (req, res) => {
  try {
    // Get dashboard_data from students
    const students = await query(
      'SELECT dashboard_data FROM students WHERE user_id = ?',
      [req.user.id]
    );
    
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Student not found'
      });
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
    
    // Get completed resources count
    const completedResources = await query(
      `SELECT COUNT(DISTINCT resource_id) as count
       FROM student_submissions
       WHERE student_id = ? AND status = 'success'`,
      [req.user.id]
    );
    
    // Mô phỏng dữ liệu quizzes
    const completedQuizzes = { count: 5 };
    const avgQuizScore = { avg_score: 85.5 };
    
    return res.json({
      success: true,
      data: {
        progress: dashboardData.progress || 0,
        level: dashboardData.level || 1,
        points: dashboardData.points || 0,
        completedResources: completedResources[0].count,
        completedQuizzes: completedQuizzes.count,
        avgQuizScore: avgQuizScore.avg_score || 0
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Update resource progress
app.post('/api/progress/resource', auth, async (req, res) => {
  try {
    const { resourceId, completed } = req.body;
    
    if (typeof resourceId !== 'number' || typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        msg: 'Invalid input'
      });
    }
    
    // Get dashboard_data
    const students = await query(
      'SELECT dashboard_data FROM students WHERE user_id = ?',
      [req.user.id]
    );
    
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Student not found'
      });
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
    
    // Update progress
    if (completed) {
      dashboardData.completed_resources = (dashboardData.completed_resources || 0) + 1;
      dashboardData.points = (dashboardData.points || 0) + 10;
    }
    
    // Calculate level and progress
    dashboardData.level = Math.floor((dashboardData.points || 0) / 100) + 1;
    dashboardData.progress = Math.min(Math.round((dashboardData.completed_resources || 0) / 100 * 100), 100);
    
    // Update database
    await query(
      'UPDATE students SET dashboard_data = ? WHERE user_id = ?',
      [JSON.stringify(dashboardData), req.user.id]
    );
    
    // Record completed resource
    if (completed) {
      await query(
        `INSERT INTO completed_resources (student_id, resource_id, completed_at)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE completed_at = NOW()`,
        [req.user.id, resourceId]
      );
    }
    
    return res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Update progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// === NOTIFICATION ROUTES ===
// Get notifications
app.get('/api/notifications', auth, async (req, res) => {
  try {
    // Mô phỏng notifications
    const notifications = [
      {
        id: 1,
        title: 'New Course Available',
        message: 'Python for Data Science is now available for enrollment.',
        is_read: false,
        created_at: '2025-05-26 10:30:00'
      },
      {
        id: 2,
        title: 'Assignment Due',
        message: 'Your JavaScript Project is due in 3 days.',
        is_read: true,
        created_at: '2025-05-25 14:15:00'
      },
      {
        id: 3,
        title: 'Achievement Unlocked',
        message: 'Congratulations! You\'ve completed 10 lessons.',
        is_read: false,
        created_at: '2025-05-24 09:20:00'
      }
    ];
    
    return res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Mark notification as read
app.put('/api/notifications/:notificationId/read', auth, async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    
    // Mô phỏng cập nhật notification
    return res.json({
      success: true,
      data: { id: parseInt(notificationId), is_read: true }
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Mark all notifications as read
app.put('/api/notifications/read-all', auth, async (req, res) => {
  try {
    // Mô phỏng đánh dấu tất cả là đã đọc
    return res.json({
      success: true,
      msg: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// === SUPPORT TICKET ROUTES ===
// Get all tickets
app.get('/api/tickets', auth, async (req, res) => {
  try {
    // Mô phỏng tickets
    const tickets = [
      {
        id: 1,
        subject: 'Problem with code execution',
        status: 'open',
        created_at: '2025-05-26 10:30:00',
        response_count: 2
      },
      {
        id: 2,
        subject: 'Account verification issue',
        status: 'in_progress',
        created_at: '2025-05-25 14:15:00',
        response_count: 1
      },
      {
        id: 3,
        subject: 'Feature request: Dark mode',
        status: 'resolved',
        created_at: '2025-05-24 09:20:00',
        response_count: 3
      }
    ];
    
    return res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Get ticket detail
app.get('/api/tickets/:id', auth, async (req, res) => {
  try {
    const ticketId = req.params.id;
    
    // Mô phỏng ticket detail
    const ticket = {
      id: parseInt(ticketId),
      subject: 'Problem with code execution',
      message: 'I\'m having trouble running my JavaScript code. It keeps showing an error about undefined variables.',
      status: 'open',
      created_at: '2025-05-26 10:30:00',
      responses: [
        {
          id: 1,
          support_user_id: 2,
          support_name: 'Support Agent',
          message: 'Could you please share the code you\'re trying to run?',
          responded_at: '2025-05-26 11:15:00'
        },
        {
          id: 2,
          support_user_id: req.user.id,
          support_name: 'You',
          message: 'Here\'s the code: console.log(myVariable);',
          responded_at: '2025-05-26 11:30:00'
        }
      ]
    };
    
    return res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Get ticket detail error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Create ticket
app.post('/api/tickets', auth, async (req, res) => {
  try {
    const { subject, message, category } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }
    
    // Mô phỏng tạo ticket
    const newTicket = {
      id: Math.floor(Math.random() * 1000) + 10,
      subject,
      message,
      category,
      status: 'open',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    
    return res.json({
      success: true,
      message: 'Ticket created successfully',
      data: newTicket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Add ticket response
app.post('/api/tickets/:id/responses', auth, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    // Mô phỏng thêm response
    const newResponse = {
      id: Math.floor(Math.random() * 1000) + 10,
      ticket_id: parseInt(ticketId),
      user_id: req.user.id,
      message,
      responded_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    
    return res.json({
      success: true,
      message: 'Response added successfully',
      data: newResponse
    });
  } catch (error) {
    console.error('Add ticket response error:', error);
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
    const students = await query('SELECT * FROM students');
    console.log(`Found ${students.length} students in database`);
    
    // Test join with users
    const studentUsers = await query(`
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

// Add a ping endpoint for connection tests
app.get('/api/ping', (req, res) => {
  res.status(200).send('pong');
});

// Default API route
app.get('/api', (req, res) => {
  res.json({
    name: 'Online Coding Platform API',
    version: '1.0.0',
    endpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/user',
      '/api/auth/me',
      '/api/student/dashboard',
      '/api/student/profile',
      '/api/resources',
      '/api/resources/:id',
      '/api/execution/run',
      '/api/execution/history/:resourceId',
      '/api/progress',
      '/api/progress/resource',
      '/api/notifications',
      '/api/tickets',
      '/api/test-db/check',
      '/api/health',
      '/api/ping'
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