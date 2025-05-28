const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); 

// Cấu hình kết nối database VPS
const dbConfig = {
  host: '202.249.25.211',
  port: 3306,
  user: 'sa',
  password: 'huy',
  database: 'online_coding_platform'
};

// Test kết nối database
router.get('/check', async (req, res) => {
  let connection;
  try {
    console.log('Attempting to connect to database on VPS...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established successfully');
    
    // Truy vấn dữ liệu từ bảng students
    const [students] = await connection.execute('SELECT * FROM students');
    console.log(`Retrieved ${students.length} students from database`);
    
    // Join với bảng users
    const [studentUsers] = await connection.execute(`
      SELECT u.*, s.* 
      FROM users u 
      JOIN students s ON u.id = s.user_id 
      WHERE u.role = 'student'
    `);
    console.log(`Retrieved ${studentUsers.length} student users with join query`);
    
    res.json({
      success: true,
      message: 'VPS database connection successful',
      data: {
        students: students,
        studentUsers: studentUsers,
        studentCount: students.length,
        studentUserCount: studentUsers.length
      }
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'VPS database connection failed',
      error: error.message,
      dbConfig: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        database: dbConfig.database
      }
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

module.exports = router;