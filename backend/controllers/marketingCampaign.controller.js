const MarketingCampaign = require('../models/marketingCampaign.model');
const { validationResult } = require('express-validator');

// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await MarketingCampaign.find()
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
};

// Get single campaign
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await MarketingCampaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      data: campaign
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create new campaign
exports.createCampaign = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const {
      title,
      description,
      startDate,
      endDate,
      targetAudience,
      status,
      channels,
      budget
    } = req.body;

    const newCampaign = new MarketingCampaign({
      title,
      description,
      startDate,
      endDate,
      targetAudience,
      status,
      channels,
      budget,
      createdBy: req.user.id
    });

    const campaign = await newCampaign.save();

    res.status(201).json({
      success: true,
      data: campaign
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update campaign
exports.updateCampaign = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const campaign = await MarketingCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Update fields
    const {
      title,
      description,
      startDate,
      endDate,
      targetAudience,
      status,
      channels,
      budget,
      metrics
    } = req.body;

    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (startDate) campaign.startDate = startDate;
    if (endDate) campaign.endDate = endDate;
    if (targetAudience) campaign.targetAudience = targetAudience;
    if (status) campaign.status = status;
    if (channels) campaign.channels = channels;
    if (budget !== undefined) campaign.budget = budget;
    if (metrics) campaign.metrics = { ...campaign.metrics, ...metrics };

    await campaign.save();

    res.json({
      success: true,
      data: campaign
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await MarketingCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    await campaign.remove();

    res.json({
      success: true,
      message: 'Campaign removed'
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
