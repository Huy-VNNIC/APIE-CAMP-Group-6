const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import User model
const User = require('../models/user.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Instructor credentials
const instructorData = {
  username: 'instructor',
  email: 'instructor@example.com',
  password: 'instructor123',
  fullName: 'John Smith',
  role: 'instructor',
  bio: 'Senior instructor with 10+ years of experience in web development and programming education.'
};

async function createInstructor() {
  try {
    // Check if instructor already exists
    const existingUser = await User.findOne({ 
      $or: [
        { username: instructorData.username },
        { email: instructorData.email }
      ]
    });
    
    if (existingUser) {
      console.log('Instructor user already exists');
      mongoose.disconnect();
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(instructorData.password, salt);
    
    // Create the instructor user
    const instructor = new User({
      ...instructorData,
      password: hashedPassword
    });
    
    await instructor.save();
    console.log('Instructor user created successfully');
    
    // Display credentials
    console.log('\nInstructor Login Credentials:');
    console.log(`Username: ${instructorData.username}`);
    console.log(`Password: ${instructorData.password}`);
    console.log('\n');
  } catch (err) {
    console.error('Error creating instructor:', err);
  } finally {
    mongoose.disconnect();
  }
}

// Run the function
createInstructor();
