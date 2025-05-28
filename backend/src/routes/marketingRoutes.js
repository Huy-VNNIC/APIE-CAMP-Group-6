const express = require('express');
const router = express.Router();
const marketingController = require('../controllers/marketingController');
const { isAuthenticated } = require('../middleware/auth');
const { isMarketing } = require('../middleware/roleCheck');

// Middleware xác thực cho tất cả routes
router.use(isAuthenticated);
router.use(isMarketing);

/**
 * @swagger
 * /api/marketing/campaigns:
 *   get:
 *     summary: Lấy danh sách chiến dịch marketing
 *     tags: [Marketing]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, scheduled, sent, canceled]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Danh sách chiến dịch
 */
router.get('/campaigns', marketingController.getCampaigns);

/**
 * @swagger
 * /api/marketing/campaigns/{campaignId}:
 *   get:
 *     summary: Lấy chi tiết chiến dịch
 *     tags: [Marketing]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết chiến dịch
 */
router.get('/campaigns/:campaignId', marketingController.getCampaignDetails);

/**
 * @swagger
 * /api/marketing/campaigns:
 *   post:
 *     summary: Tạo chiến dịch mới
 *     tags: [Marketing]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - targetRoles
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               targetRoles:
 *                 type: array
 *                 items:
 *                   type: string
 *               campaignType:
 *                 type: string
 *                 enum: [email, notification, banner]
 *               scheduleDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Chiến dịch đã được tạo
 */
router.post('/campaigns', marketingController.createCampaign);

/**
 * @swagger
 * /api/marketing/campaigns/{campaignId}:
 *   put:
 *     summary: Cập nhật chiến dịch
 *     tags: [Marketing]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               targetRoles:
 *                 type: array
 *                 items:
 *                   type: string
 *               campaignType:
 *                 type: string
 *                 enum: [email, notification, banner]
 *               status:
 *                 type: string
 *                 enum: [draft, scheduled, canceled]
 *               scheduleDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Chiến dịch đã được cập nhật
 */
router.put('/campaigns/:campaignId', marketingController.updateCampaign);

/**
 * @swagger
 * /api/marketing/campaigns/{campaignId}/send:
 *   post:
 *     summary: Gửi chiến dịch
 *     tags: [Marketing]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chiến dịch đang được gửi
 */
router.post('/campaigns/:campaignId/send', marketingController.sendCampaign);

/**
 * @swagger
 * /api/marketing/campaigns/{campaignId}:
 *   delete:
 *     summary: Xóa chiến dịch
 *     tags: [Marketing]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chiến dịch đã được xóa
 */
router.delete('/campaigns/:campaignId', marketingController.deleteCampaign);

/**
 * @swagger
 * /api/marketing/email-templates:
 *   get:
 *     summary: Lấy danh sách template email
 *     tags: [Marketing]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách template
 */
router.get('/email-templates', marketingController.getEmailTemplates);

/**
 * @swagger
 * /api/marketing/email-templates:
 *   post:
 *     summary: Tạo template email mới
 *     tags: [Marketing]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - subject
 *               - content
 *             properties:
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *               content:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Template đã được tạo
 */
router.post('/email-templates', marketingController.createEmailTemplate);

/**
 * @swagger
 * /api/marketing/stats:
 *   get:
 *     summary: Lấy thống kê marketing
 *     tags: [Marketing]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê marketing
 */
router.get('/stats', marketingController.getMarketingStats);

module.exports = router;