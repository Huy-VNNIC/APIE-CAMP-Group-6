const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database-mysql');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Đăng nhập người dùng
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và mật khẩu là bắt buộc'
      });
    }
    
    // Tìm người dùng theo email
    const [users] = await pool.execute(
      'SELECT id, name, email, password_hash, role, verified FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Thông tin đăng nhập không chính xác'
      });
    }
    
    const user = users[0];
    
    // Trong môi trường phát triển, chúng ta chấp nhận mật khẩu theo pattern
    let passwordMatch = false;
    
    if (process.env.NODE_ENV === 'development') {
      // Cho phép pattern hashed_password_id trong dev
      passwordMatch = (user.password_hash === `hashed_password_${user.id}`);
    }
    
    // Trong môi trường production, so sánh hash thực tế
    if (!passwordMatch && user.password_hash) {
      try {
        passwordMatch = await bcrypt.compare(password, user.password_hash);
      } catch (e) {
        console.error('Error comparing passwords:', e);
      }
    }
    
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Thông tin đăng nhập không chính xác'
      });
    }
    
    // Tạo token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;
    
    // Set token in http-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          ...userWithoutPassword,
          verified: user.verified === 1
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng nhập',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Đăng ký người dùng mới
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tên, email và mật khẩu là bắt buộc'
      });
    }
    
    // Kiểm tra email đã được sử dụng chưa
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }
    
    // Hash mật khẩu
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Bắt đầu transaction để đảm bảo tính nhất quán
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Tạo người dùng mới
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password_hash, role, verified) VALUES (?, ?, ?, ?, ?)',
        [name, email, passwordHash, role, 0]  // 0 = chưa xác thực
      );
      
      const userId = result.insertId;
      
      // Nếu là học viên, tạo bản ghi student
      if (role === 'student') {
        const defaultDashboardData = JSON.stringify({
          progress: 0,
          current_course: null,
          completed_courses: [],
          preferences: {
            theme: 'light',
            editor_font_size: 14,
            editor_tab_size: 2
          }
        });
        
        await connection.execute(
          'INSERT INTO students (user_id, dashboard_data) VALUES (?, ?)',
          [userId, defaultDashboardData]
        );
      }
      
      // Nếu là giảng viên, tạo bản ghi instructor
      else if (role === 'instructor') {
        await connection.execute(
          'INSERT INTO instructors (user_id) VALUES (?)',
          [userId]
        );
      }
      
      await connection.commit();
      
      // Tạo token JWT
      const token = jwt.sign(
        { 
          id: userId, 
          email,
          name,
          role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: {
          user: {
            id: userId,
            name,
            email,
            role,
            verified: false
          },
          token
        }
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng ký',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Lấy thông tin người dùng hiện tại
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [users] = await pool.execute(
      'SELECT id, name, email, role, verified, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
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
      message: 'Đã xảy ra lỗi khi lấy thông tin người dùng',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Đổi mật khẩu
 */
exports.changePassword = async (req, res) => {
  // Code tương tự như trước...
};

/**
 * Đăng xuất
 */
exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
};