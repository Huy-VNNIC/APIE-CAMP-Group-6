const mongoose = require('mongoose');

const PromotionalContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  contentType: {
    type: String,
    enum: ['banner', 'email', 'social', 'blog', 'video', 'newsletter'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  linkUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketingCampaign'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metrics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('PromotionalContent', PromotionalContentSchema);
