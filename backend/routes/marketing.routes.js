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

// Campaign routes
router.get('/campaigns', [auth, marketingAuth], marketingCampaignController.getAllCampaigns);
router.get('/campaigns/:id', [auth, marketingAuth], marketingCampaignController.getCampaign);
router.post('/campaigns', [
  auth, 
  marketingAuth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('endDate', 'End date is required').not().isEmpty()
  ]
], marketingCampaignController.createCampaign);
router.put('/campaigns/:id', [auth, marketingAuth], marketingCampaignController.updateCampaign);
router.delete('/campaigns/:id', [auth, marketingAuth], marketingCampaignController.deleteCampaign);

// Promotional content routes
router.get('/promotional-content', [auth, marketingAuth], promotionalContentController.getAllPromotionalContent);
router.get('/promotional-content/campaign/:campaignId', [auth, marketingAuth], promotionalContentController.getPromotionalContentByCampaign);
router.get('/promotional-content/:id', [auth, marketingAuth], promotionalContentController.getPromotionalContent);
router.post('/promotional-content', [
  auth, 
  marketingAuth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('contentType', 'Content type is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty()
  ]
], promotionalContentController.createPromotionalContent);
router.put('/promotional-content/:id', [auth, marketingAuth], promotionalContentController.updatePromotionalContent);
router.delete('/promotional-content/:id', [auth, marketingAuth], promotionalContentController.deletePromotionalContent);

// Partnership routes
router.get('/partnerships', [auth, marketingAuth], partnershipController.getAllPartnerships);
router.get('/partnerships/:id', [auth, marketingAuth], partnershipController.getPartnership);
router.post('/partnerships', [
  auth, 
  marketingAuth,
  [
    check('partnerName', 'Partner name is required').not().isEmpty(),
    check('partnerType', 'Partner type is required').not().isEmpty(),
    check('contactPerson.name', 'Contact person name is required').not().isEmpty(),
    check('contactPerson.email', 'Contact person email is required').isEmail(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ]
], partnershipController.createPartnership);
router.put('/partnerships/:id', [auth, marketingAuth], partnershipController.updatePartnership);
router.delete('/partnerships/:id', [auth, marketingAuth], partnershipController.deletePartnership);

// Engagement metrics routes
router.get('/metrics', [auth, marketingAuth], engagementMetricsController.getAllMetrics);
router.get('/metrics/summary', [auth, marketingAuth], engagementMetricsController.getMetricsSummary);
router.get('/metrics/campaign/:campaignId', [auth, marketingAuth], engagementMetricsController.getMetricsByCampaign);
router.get('/metrics/:id', [auth, marketingAuth], engagementMetricsController.getMetric);
router.post('/metrics', [
  auth, 
  marketingAuth,
  [
    check('metrics', 'Metrics data is required').not().isEmpty(),
    check('source', 'Source is required').not().isEmpty()
  ]
], engagementMetricsController.createMetric);
router.put('/metrics/:id', [auth, marketingAuth], engagementMetricsController.updateMetric);
router.delete('/metrics/:id', [auth, marketingAuth], engagementMetricsController.deleteMetric);

module.exports = router;
