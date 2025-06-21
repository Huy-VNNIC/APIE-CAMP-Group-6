#!/bin/sh

# Add bcryptjs package if missing
if ! grep -q "bcryptjs" package.json; then
  echo "Adding bcryptjs dependency..."
  npm install --save bcryptjs
fi

# Create initial users (instructor and marketing)
echo "Setting up initial users..."

# Wait for MongoDB connection before running scripts
echo "Waiting for MongoDB connection..."
node -e "
const mongoose = require('mongoose');
const waitForMongo = async () => {
  let connected = false;
  while (!connected) {
    try {
      await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      connected = true;
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.log('Waiting for MongoDB connection... (retrying in 2 seconds)');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  mongoose.disconnect(); // Disconnect after successful connection
  process.exit(0); // Explicitly exit the Node.js process to continue the script
};
waitForMongo();
" || exit 1

# Try to create users but don't exit if they fail
echo "Creating instructor user..."
node scripts/create-instructor.js || echo "Warning: Failed to create instructor user but continuing"

echo "Creating marketing user..."
node scripts/create-marketing-user.js || echo "Warning: Failed to create marketing user but continuing"

# Start the application
echo "Starting the application..."
node index.js
