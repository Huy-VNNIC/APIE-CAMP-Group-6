const mysql = require('mysql2/promise');

const checkUTCFormat = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: '202.249.25.211',
      port: 3306,
      user: 'sa',
      password: 'huy',
      database: 'online_coding_platform'
    });
    
    // Lấy thời gian UTC hiện tại từ database
    const [result] = await connection.execute('SELECT UTC_TIMESTAMP() as utc_time');
    const dbUtcTime = result[0].utc_time;
    
    // Định dạng thời gian theo yêu cầu
    const formattedDbTime = formatDateTime(dbUtcTime);
    
    // Lấy thời gian UTC hiện tại từ JavaScript
    const jsUtcTime = new Date();
    const formattedJsTime = formatDateTime(jsUtcTime);
    
    console.log('Thời gian UTC từ database:', formattedDbTime);
    console.log('Thời gian UTC từ JavaScript:', formattedJsTime);
    console.log('Thời gian UTC hiển thị trên frontend:', '2025-05-28 03:06:52');
    
    // So sánh với thời gian hiển thị trên frontend
    console.log('Định dạng thời gian frontend có đúng không:', 
                isValidFormat('2025-05-28 03:06:52'));
    
    return formattedDbTime;
  } catch (error) {
    console.error('Lỗi truy vấn:', error);
    return null;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Hàm định dạng thời gian
function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Kiểm tra định dạng thời gian có đúng không
function isValidFormat(dateTimeString) {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  return regex.test(dateTimeString);
}

checkUTCFormat();