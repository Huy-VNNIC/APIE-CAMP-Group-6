const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username không được để trống'],
    unique: true,
    trim: true,
    maxlength: [50, 'Username không được vượt quá 50 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Email không được để trống'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Email không hợp lệ'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password không được để trống'],
    minlength: [6, 'Password phải có ít nhất 6 ký tự'],
    select: false
  },
  fullName: {
    type: String,
    required: [true, 'Tên đầy đủ không được để trống']
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Mã hóa password trước khi lưu
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Phương thức so sánh password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Phương thức tạo JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

module.exports = mongoose.model('User', UserSchema);
