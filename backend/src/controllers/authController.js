const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password || !fullName || !role) {
      return res.status(400).json({ message: 'Tất cả các trường là bắt buộc' });
    }
    
    // Kiểm tra role hợp lệ
    const validRoles = ['student', 'instructor', 'support', 'marketing', 'developer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Role không hợp lệ' });
    }
    
    // Kiểm tra username đã tồn tại chưa
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username đã tồn tại' });
    }
    
    // Tạo user mới
    const newUser = await User.create({ username, email, password, fullName, role });
    
    // Tạo token JWT
    const token = jwt.sign(
      { id: newUser.user_id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    
    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name,
        role: newUser.role
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      return res.status(400).json({ message: 'Username và password là bắt buộc' });
    }
    
    // Tìm user theo username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    }
    
    // Kiểm tra mật khẩu
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    }
    
    // Tạo token JWT
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.status(200).json({
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        createdAt: user.created_at
      }
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
