const Partnership = require('../models/partnership.model');
const { validationResult } = require('express-validator');

// Get all partnerships
exports.getAllPartnerships = async (req, res) => {
  try {
    const partnerships = await Partnership.find()
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: partnerships.length,
      data: partnerships
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
};

// Get single partnership
exports.getPartnership = async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);
    
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }

    res.json({
      success: true,
      data: partnership
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create new partnership
exports.createPartnership = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const {
      partnerName,
      partnerType,
      contactPerson,
      startDate,
      endDate,
      description,
      goals,
      benefits,
      status,
      documents
    } = req.body;

    const newPartnership = new Partnership({
      partnerName,
      partnerType,
      contactPerson,
      startDate,
      endDate,
      description,
      goals,
      benefits,
      status,
      documents,
      createdBy: req.user.id
    });

    const partnership = await newPartnership.save();

    res.status(201).json({
      success: true,
      data: partnership
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update partnership
exports.updatePartnership = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const partnership = await Partnership.findById(req.params.id);

    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }

    // Update fields
    const {
      partnerName,
      partnerType,
      contactPerson,
      startDate,
      endDate,
      description,
      goals,
      benefits,
      status,
      documents
    } = req.body;

    if (partnerName) partnership.partnerName = partnerName;
    if (partnerType) partnership.partnerType = partnerType;
    if (contactPerson) partnership.contactPerson = contactPerson;
    if (startDate) partnership.startDate = startDate;
    if (endDate) partnership.endDate = endDate;
    if (description) partnership.description = description;
    if (goals) partnership.goals = goals;
    if (benefits) partnership.benefits = benefits;
    if (status) partnership.status = status;
    if (documents) partnership.documents = documents;

    await partnership.save();

    res.json({
      success: true,
      data: partnership
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete partnership
exports.deletePartnership = async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);

    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }

    await partnership.remove();

    res.json({
      success: true,
      message: 'Partnership removed'
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
