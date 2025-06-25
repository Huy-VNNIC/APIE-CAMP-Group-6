const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use URI from environment variable or default URI
    // In Docker, the MongoDB hostname will be 'mongodb'
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/coding-platform';
    
    // Check if we should skip MongoDB connection
    if (process.env.SKIP_DB_CONNECTION === 'true') {
      console.log('Skipping database connection as per configuration');
      return;
    }
    
    console.log(`Attempting to connect to MongoDB at ${mongoURI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);
    
    // Set connection options with longer timeouts for Docker environment
    const options = {
      connectTimeoutMS: 60000, // 60 seconds
      socketTimeoutMS: 75000,  // 75 seconds
      serverSelectionTimeoutMS: 90000, // 90 seconds
      // Additional connection options to make it more resilient
      retryWrites: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    
    // Try to connect multiple times
    let attempts = 0;
    const maxAttempts = 5;
    let conn;
    
    while (attempts < maxAttempts) {
      try {
        console.log(`MongoDB connection attempt ${attempts + 1} of ${maxAttempts}`);
        conn = await mongoose.connect(mongoURI, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        break; // Success, exit loop
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw err; // Rethrow if we've reached max attempts
        }
        console.log(`Connection failed, retrying in 5 seconds... (${attempts}/${maxAttempts})`);
        // Wait 5 seconds before retry
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    // Set up connection error handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Set up reconnection
    mongoose.connection.on('disconnected', async () => {
      console.log('MongoDB disconnected, attempting to reconnect...');
      try {
        await mongoose.connect(mongoURI, options);
        console.log('MongoDB reconnected successfully');
      } catch (error) {
        console.error('MongoDB reconnection failed:', error.message);
      }
    });
    
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Database connection failed. Continuing without database...');
    // Don't throw the error - allow the app to start even without DB
  }
};

module.exports = connectDB;
