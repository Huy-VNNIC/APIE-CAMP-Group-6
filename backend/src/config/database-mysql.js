const mysql = require('mysql2/promise');

// Tạo connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '202.249.25.211',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'huy',
  database: process.env.DB_DATABASE || 'online_coding_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connection successful!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    return false;
  }
};

// Helper để thực hiện các truy vấn
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

module.exports = { pool, query, testConnection };