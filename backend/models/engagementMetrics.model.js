const mongoose = require('mongoose');

const EngagementMetricsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  userSegment: {
    type: String,
    enum: ['all', 'students', 'instructors', 'new', 'returning'],
    default: 'all'
  },
  metrics: {
    activeUsers: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    averageSessionDuration: { type: Number, default: 0 }, // in seconds
    bounceRate: { type: Number, default: 0 }, // percentage
    courseEnrollments: { type: Number, default: 0 },
    courseCompletions: { type: Number, default: 0 },
    quizAttempts: { type: Number, default: 0 },
    feedbackSubmissions: { type: Number, default: 0 }
  },
  source: {
    type: String,
    enum: ['website', 'app', 'email', 'social', 'search', 'direct', 'referral', 'campaign'],
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketingCampaign'
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('EngagementMetrics', EngagementMetricsSchema);
