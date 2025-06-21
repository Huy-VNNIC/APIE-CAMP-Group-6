const mongoose = require('mongoose');

const MarketingCampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  targetAudience: {
    type: String,
    enum: ['students', 'instructors', 'all'],
    default: 'all'
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  channels: [{
    type: String,
    enum: ['email', 'social', 'website', 'push', 'sms'],
  }],
  budget: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('MarketingCampaign', MarketingCampaignSchema);
