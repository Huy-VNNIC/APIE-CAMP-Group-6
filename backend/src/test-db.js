require('dotenv').config();
const { testConnection } = require('./src/config/database');

// Kiểm tra kết nối database
async function testDb() {
  try {
    console.log('Testing database connection...');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_DATABASE:', process.env.DB_DATABASE);
    
    const connected = await testConnection();
    
    if (connected) {
      console.log('✓ Database connection successful!');
    } else {
      console.error('✗ Database connection failed!');
    }
  } catch (error) {
    console.error('Error testing connection:', error);
  }
  process.exit();
}

testDb();