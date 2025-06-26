const PromotionalContent = require('../models/promotionalContent.model');
const { validationResult } = require('express-validator');

// Get all promotional content
exports.getAllPromotionalContent = async (req, res) => {
  try {
    const promotionalContent = await PromotionalContent.find()
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: promotionalContent.length,
      data: promotionalContent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
};

// Get promotional content by campaign
exports.getPromotionalContentByCampaign = async (req, res) => {
  try {
    const promotionalContent = await PromotionalContent.find({ 
      campaign: req.params.campaignId 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: promotionalContent.length,
      data: promotionalContent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get single promotional content
exports.getPromotionalContent = async (req, res) => {
  try {
    const content = await PromotionalContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Promotional content not found'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Promotional content not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create new promotional content
exports.createPromotionalContent = async (req, res) => {
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
      contentType,
      description,
      content,
      imageUrl,
      linkUrl,
      status,
      campaign
    } = req.body;

    const newContent = new PromotionalContent({
      title,
      contentType,
      description,
      content,
      imageUrl,
      linkUrl,
      status,
      campaign,
      createdBy: req.user?.id || '507f1f77bcf86cd799439011' // Default ObjectId for marketing user
    });

    const savedContent = await newContent.save();

    res.status(201).json({
      success: true,
      data: savedContent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update promotional content
exports.updatePromotionalContent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const content = await PromotionalContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Promotional content not found'
      });
    }

    // Update fields
    const {
      title,
      contentType,
      description,
      content: contentText,
      imageUrl,
      linkUrl,
      status,
      campaign,
      metrics
    } = req.body;

    if (title) content.title = title;
    if (contentType) content.contentType = contentType;
    if (description) content.description = description;
    if (contentText) content.content = contentText;
    if (imageUrl) content.imageUrl = imageUrl;
    if (linkUrl) content.linkUrl = linkUrl;
    if (status) content.status = status;
    if (campaign) content.campaign = campaign;
    if (metrics) content.metrics = { ...content.metrics, ...metrics };

    await content.save();

    res.json({
      success: true,
      data: content
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Promotional content not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete promotional content
exports.deletePromotionalContent = async (req, res) => {
  try {
    const content = await PromotionalContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Promotional content not found'
      });
    }

    await content.remove();

    res.json({
      success: true,
      message: 'Promotional content removed'
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Promotional content not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
