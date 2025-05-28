const { Sequelize } = require('sequelize');

// Tạo instance Sequelize
const sequelize = new Sequelize(
  process.env.DB_DATABASE || 'online_coding_platform',
  process.env.DB_USER || 'sa',
  process.env.DB_PASSWORD || 'huy',
  {
    host: process.env.DB_HOST || '202.249.25.211',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Kiểm tra kết nối
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = { sequelize, testConnection };