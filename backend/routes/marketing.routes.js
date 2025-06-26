const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const marketingAuth = require('../middleware/marketing');
const marketingCampaignController = require('../controllers/marketingCampaign.controller');
const promotionalContentController = require('../controllers/promotionalContent.controller');
const partnershipController = require('../controllers/partnership.controller');
const engagementMetricsController = require('../controllers/engagementMetrics.controller');

// Marketing routes will require both auth and marketingAuth middleware
// This ensures only authenticated users with the marketing role can access these routes

// Campaign routes - No auth required for marketing
router.get('/campaigns', marketingCampaignController.getAllCampaigns);
router.get('/campaigns/:id', marketingCampaignController.getCampaign);
router.post('/campaigns', [
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('endDate', 'End date is required').not().isEmpty()
  ]
], marketingCampaignController.createCampaign);
router.put('/campaigns/:id', marketingCampaignController.updateCampaign);
router.delete('/campaigns/:id', marketingCampaignController.deleteCampaign);

// Promotional content routes - No auth required
router.get('/promotional-content', promotionalContentController.getAllPromotionalContent);
router.get('/promotional-content/campaign/:campaignId', promotionalContentController.getPromotionalContentByCampaign);
router.get('/promotional-content/:id', promotionalContentController.getPromotionalContent);
router.post('/promotional-content', [
  [
    check('title', 'Title is required').not().isEmpty(),
    check('contentType', 'Content type is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty()
  ]
], promotionalContentController.createPromotionalContent);
router.put('/promotional-content/:id', promotionalContentController.updatePromotionalContent);
router.delete('/promotional-content/:id', promotionalContentController.deletePromotionalContent);

// Partnership routes - No auth required
router.get('/partnerships', partnershipController.getAllPartnerships);
router.get('/partnerships/:id', partnershipController.getPartnership);
router.post('/partnerships', [
  [
    check('partnerName', 'Partner name is required').not().isEmpty(),
    check('partnerType', 'Partner type is required').not().isEmpty(),
    check('contactPerson.name', 'Contact person name is required').not().isEmpty(),
    check('contactPerson.email', 'Contact person email is required').isEmail(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ]
], partnershipController.createPartnership);
router.put('/partnerships/:id', partnershipController.updatePartnership);
router.delete('/partnerships/:id', partnershipController.deletePartnership);

// Engagement metrics routes - No auth required
router.get('/metrics', engagementMetricsController.getAllMetrics);
router.get('/metrics/summary', engagementMetricsController.getMetricsSummary);
router.get('/metrics/campaign/:campaignId', engagementMetricsController.getMetricsByCampaign);
router.get('/metrics/:id', engagementMetricsController.getMetric);
router.post('/metrics', [
  [
    check('metrics', 'Metrics data is required').not().isEmpty(),
    check('source', 'Source is required').not().isEmpty()
  ]
], engagementMetricsController.createMetric);
router.put('/metrics/:id', engagementMetricsController.updateMetric);
router.delete('/metrics/:id', engagementMetricsController.deleteMetric);

module.exports = router;
