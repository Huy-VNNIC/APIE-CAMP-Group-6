const mysql = require('mysql2/promise');
require('dotenv').config();

// Tạo pool connection để quản lý kết nối hiệu quả
const pool = mysql.createPool({
  host: process.env.DB_HOST || '202.249.25.211',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'huy',
  database: process.env.DB_NAME || 'online_coding_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Hàm helper để thực thi truy vấn
const query = async (sql, params) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

module.exports = {
  query,
  pool
};