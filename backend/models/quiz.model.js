const mongoose = require('mongoose');

// Option Schema
const OptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

// Question Schema
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [OptionSchema],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  explanation: String
});

// Quiz Schema
const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  description: String,
  timeLimit: {
    type: Number, // in minutes
    default: 30
  },
  passingScore: {
    type: Number, // percentage
    default: 70
  },
  questions: [QuestionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  timesCompleted: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
