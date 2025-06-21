// Script to create a marketing user for testing
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

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

// Create marketing user
const createMarketingUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username: marketingUser.username });
    if (existingUser) {
      console.log('Marketing user already exists!');
      process.exit(0);
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
    process.exit(0);
  } catch (err) {
    console.error('Error creating marketing user:', err);
    process.exit(1);
  }
};

// Run the function
createMarketingUser();
