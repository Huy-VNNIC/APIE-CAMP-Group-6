const mysql = require('mysql2/promise');

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

// Helper function để thực thi queries
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

module.exports = {
  pool,
  query
};