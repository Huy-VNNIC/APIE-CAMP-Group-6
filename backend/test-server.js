require('dotenv').config();
console.log('Testing database connection...');
console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

const { Sequelize } = require('sequelize');

// Tạo instance Sequelize để test kết nối
const sequelize = new Sequelize(
  process.env.DB_DATABASE || 'online_coding_platform',
  process.env.DB_USER || 'sa',
  process.env.DB_PASSWORD || 'huy',
  {
    host: process.env.DB_HOST || '202.249.25.211',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log
  }
);

// Kiểm tra kết nối
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection successful!');
  } catch (error) {
    console.error('✗ Database connection failed!');
    console.error('Error details:', error);
  } finally {
    process.exit();
  }
}

testConnection();