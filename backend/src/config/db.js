const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use URI from environment variable or default URI
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/coding-platform';
    
    // Kiểm tra nếu không sử dụng MongoDB, có thể bỏ qua kết nối
    if (process.env.SKIP_DB_CONNECTION === 'true') {
      console.log('Skipping database connection as per configuration');
      return;
    }
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('Database connection failed. Continuing without database...');
  }
};

module.exports = connectDB;
