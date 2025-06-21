const mongoose = require('mongoose');

const PartnershipSchema = new mongoose.Schema({
  partnerName: {
    type: String,
    required: true,
    trim: true
  },
  partnerType: {
    type: String,
    enum: ['educational', 'corporate', 'nonprofit', 'technology', 'media'],
    required: true
  },
  contactPerson: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  description: {
    type: String,
    required: true
  },
  goals: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['proposed', 'active', 'completed', 'cancelled'],
    default: 'proposed'
  },
  documents: [{
    title: { type: String },
    url: { type: String }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Partnership', PartnershipSchema);
