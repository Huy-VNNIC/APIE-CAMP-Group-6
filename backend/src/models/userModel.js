const { query } = require('../config/db');
const bcrypt = require('bcrypt');

const userModel = {
  // Tạo user mới (đăng ký)
  async create(userData) {
    const { name, email, password, role = 'student' } = userData;
    
    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const sql = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await query(sql, [name, email, password_hash, role]);
    
    if (role === 'student') {
      // Tạo bản ghi trong bảng students
      await query(
        'INSERT INTO students (user_id, dashboard_data) VALUES (?, ?)',
        [result.insertId, JSON.stringify({ progress: 0, level: 1, points: 0, completed_resources: 0 })]
      );
    }
    
    return { id: result.insertId };
  },
  
  // Tìm user theo email
  async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await query(sql, [email]);
    return users.length ? users[0] : null;
  },
  
  // Tìm user theo ID
  async findById(id) {
    const sql = 'SELECT id, name, email, role, verified, created_at FROM users WHERE id = ?';
    const users = await query(sql, [id]);
    return users.length ? users[0] : null;
  },
  
  // Xác thực user (login)
  async authenticate(email, password) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return null;
    }
    
    // Không trả về password_hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};

module.exports = userModel;