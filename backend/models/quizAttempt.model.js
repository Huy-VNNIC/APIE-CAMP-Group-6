const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  quizTitle: String,
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
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedOption: mongoose.Schema.Types.ObjectId,
    isCorrect: Boolean
  }],
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  passed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'timeout'],
    default: 'in_progress'
  }
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
