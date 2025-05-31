const mongoose = require('mongoose');

// Track progress for each lesson
const LessonProgressSchema = new mongoose.Schema({
  lessonId: String,
  completed: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

// Student progress for a course
const StudentProgressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseName: String,
  enrollDate: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  lessonsProgress: [LessonProgressSchema],
  completedLessons: {
    type: Number,
    default: 0
  },
  totalLessons: {
    type: Number,
    required: true
  },
  progress: {
    type: Number, // percentage
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completionDate: Date,
  quizzes: [{
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    score: Number,
    attempts: Number,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  assignments: [{
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment'
    },
    submitted: {
      type: Boolean,
      default: false
    },
    submissionDate: Date,
    grade: Number,
    feedback: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('StudentProgress', StudentProgressSchema);
