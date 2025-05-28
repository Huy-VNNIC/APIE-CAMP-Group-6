const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../middleware/auth');

// Tất cả routes đều yêu cầu xác thực
router.use(auth);

// Lấy tất cả resources
router.get('/', resourceController.getAllResources);

// Lấy resources theo loại
router.get('/type/:type', resourceController.getResourcesByType);

// Lấy chi tiết một resource
router.get('/:id', resourceController.getResourceById);

module.exports = router;