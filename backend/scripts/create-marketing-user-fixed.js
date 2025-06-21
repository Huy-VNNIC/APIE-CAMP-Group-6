// Script to create a marketing user for testing
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// User model definition (copied to avoid requiring the model file)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin', 'marketing'], default: 'student' },
  bio: { type: String },
  avatar: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Marketing user details
const marketingUser = {
  username: 'marketing',
  email: 'marketing@example.com',
  password: 'marketing123',
  fullName: 'Marketing Manager',
  role: 'marketing',
  bio: 'Marketing manager responsible for campaigns, promotions, and partnerships.',
  avatar: ''
};

// Connect to MongoDB and create user
const createMarketingUser = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://mongodb:27017/coding_platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB connected successfully');

    // Check if user already exists
    const existingUser = await User.findOne({ username: marketingUser.username });
    if (existingUser) {
      console.log('Marketing user already exists!');
      mongoose.disconnect();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(marketingUser.password, salt);

    // Create new user
    const user = new User({
      ...marketingUser,
      password: hashedPassword
    });

    await user.save();
    console.log('Marketing user created successfully!');
    
    // Close the connection
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Error creating marketing user:', err);
  }
};

// Run the function
createMarketingUser();
