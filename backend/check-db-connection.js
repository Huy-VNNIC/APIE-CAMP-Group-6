const mysql = require('mysql2/promise');

const testDbConnection = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: '202.249.25.211',
      port: 3306,
      user: 'sa',
      password: 'huy',
      database: 'online_coding_platform'
    });
    
    console.log('Kết nối MySQL thành công!');
    
    // Kiểm tra bảng users
    const [users] = await connection.execute('SELECT * FROM users LIMIT 5');
    console.log('Danh sách users:', users);
    
    // Kiểm tra bảng students
    const [students] = await connection.execute('SELECT * FROM students LIMIT 5');
    console.log('Danh sách students:', students);
    
    return true;
  } catch (error) {
    console.error('Lỗi kết nối MySQL:', error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

testDbConnection();