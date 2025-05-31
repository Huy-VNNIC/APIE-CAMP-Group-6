const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await db.query(query, [username]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(userData) {
    const { username, email, password, fullName, role } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (username, email, password_hash, full_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [username, email, passwordHash, fullName, role];
    const result = await db.query(query, values);
    
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getAllUsers() {
    const query = 'SELECT user_id, username, email, full_name, role, created_at FROM users';
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = User;
