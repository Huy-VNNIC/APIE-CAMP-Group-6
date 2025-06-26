const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const marketing = require('../middleware/marketing');
const marketingAIController = require('../controllers/marketingAI.controller');

// @route   POST api/marketing/ai/campaign-ideas
// @desc    Generate campaign ideas using AI
// @access  Public (no auth required)
router.post('/campaign-ideas', [
  [
    check('prompt', 'Prompt is required').not().isEmpty()
  ]
], marketingAIController.generateCampaignIdeas);

// @route   POST api/marketing/ai/content-suggestions
// @desc    Generate content suggestions for a campaign
// @access  Public (no auth required)
router.post('/content-suggestions', [
  [
    check('title', 'Campaign title is required').not().isEmpty(),
    check('description', 'Campaign description is required').not().isEmpty()
  ]
], marketingAIController.generateContentSuggestions);

// @route   POST api/marketing/ai/analyze-audience
// @desc    Analyze target audience using AI
// @access  Private (marketing role)
router.post('/analyze-audience', [
  [
    check('targetAudience', 'Target audience is required').not().isEmpty()
  ]
], marketingAIController.analyzeTargetAudience);

// @route   POST api/marketing/ai/optimize-campaign/:id
// @desc    Optimize an existing campaign
// @access  Public (no auth required)
router.post('/optimize-campaign/:id', marketingAIController.optimizeCampaign);

module.exports = router;
