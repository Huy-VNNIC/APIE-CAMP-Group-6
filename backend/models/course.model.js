const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'other']
  },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  instructorTitle: String,
  instructorBio: String,
  image: {
    type: String,
    default: 'https://placehold.co/600x400/4caf50/fff?text=Course'
  },
  duration: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'English'
  },
  lessons: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    duration: String,
    videoUrl: String,
    content: String,
    isPreview: {
      type: Boolean,
      default: false
    },
    order: Number
  }],
  outcomes: [String],
  enrollments: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
