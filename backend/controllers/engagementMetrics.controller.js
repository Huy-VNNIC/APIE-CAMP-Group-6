const EngagementMetrics = require('../models/engagementMetrics.model');
const { validationResult } = require('express-validator');

// Get all metrics
exports.getAllMetrics = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { startDate, endDate, userSegment, source, campaign } = req.query;
    
    // Build query object
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }
    
    if (userSegment) query.userSegment = userSegment;
    if (source) query.source = source;
    if (campaign) query.campaign = campaign;

    const metrics = await EngagementMetrics.find(query)
      .sort({ date: -1 });
    
    res.json({
      success: true,
      count: metrics.length,
      data: metrics
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
};

// Get metrics summary
exports.getMetricsSummary = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { startDate, endDate, userSegment, source } = req.query;
    
    // Build query object
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    } else {
      // Default to last 30 days if no dates provided
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.date = { $gte: thirtyDaysAgo };
    }
    
    if (userSegment) query.userSegment = userSegment;
    if (source) query.source = source;

    // Aggregation pipeline to get summary metrics
    const summary = await EngagementMetrics.aggregate([
      { $match: query },
      { $group: {
        _id: null,
        totalActiveUsers: { $sum: '$metrics.activeUsers' },
        totalPageViews: { $sum: '$metrics.pageViews' },
        avgSessionDuration: { $avg: '$metrics.averageSessionDuration' },
        avgBounceRate: { $avg: '$metrics.bounceRate' },
        totalEnrollments: { $sum: '$metrics.courseEnrollments' },
        totalCompletions: { $sum: '$metrics.courseCompletions' },
        totalQuizAttempts: { $sum: '$metrics.quizAttempts' },
        totalFeedback: { $sum: '$metrics.feedbackSubmissions' },
      }},
    ]);
    
    res.json({
      success: true,
      data: summary.length > 0 ? summary[0] : {
        totalActiveUsers: 0,
        totalPageViews: 0,
        avgSessionDuration: 0,
        avgBounceRate: 0,
        totalEnrollments: 0,
        totalCompletions: 0,
        totalQuizAttempts: 0,
        totalFeedback: 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get metrics by campaign
exports.getMetricsByCampaign = async (req, res) => {
  try {
    const metrics = await EngagementMetrics.find({ 
      campaign: req.params.campaignId 
    }).sort({ date: -1 });
    
    res.json({
      success: true,
      count: metrics.length,
      data: metrics
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get single metric
exports.getMetric = async (req, res) => {
  try {
    const metric = await EngagementMetrics.findById(req.params.id);
    
    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Metrics record not found'
      });
    }

    res.json({
      success: true,
      data: metric
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Metrics record not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create new metrics record
exports.createMetric = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const {
      date,
      userSegment,
      metrics,
      source,
      campaign,
      notes
    } = req.body;

    const newMetric = new EngagementMetrics({
      date: date || Date.now(),
      userSegment,
      metrics,
      source,
      campaign,
      notes
    });

    const savedMetric = await newMetric.save();

    res.status(201).json({
      success: true,
      data: savedMetric
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update metrics
exports.updateMetric = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const metric = await EngagementMetrics.findById(req.params.id);

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Metrics record not found'
      });
    }

    // Update fields
    const {
      date,
      userSegment,
      metrics: metricsData,
      source,
      campaign,
      notes
    } = req.body;

    if (date) metric.date = date;
    if (userSegment) metric.userSegment = userSegment;
    if (metricsData) metric.metrics = { ...metric.metrics, ...metricsData };
    if (source) metric.source = source;
    if (campaign) metric.campaign = campaign;
    if (notes !== undefined) metric.notes = notes;

    await metric.save();

    res.json({
      success: true,
      data: metric
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Metrics record not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete metrics record
exports.deleteMetric = async (req, res) => {
  try {
    const metric = await EngagementMetrics.findById(req.params.id);

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Metrics record not found'
      });
    }

    await metric.remove();

    res.json({
      success: true,
      message: 'Metrics record removed'
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Metrics record not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
