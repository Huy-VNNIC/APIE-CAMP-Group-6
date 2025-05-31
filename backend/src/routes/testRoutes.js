const express = require('express');
const containerService = require('../services/containerService');
const router = express.Router();

// Test endpoint - không yêu cầu xác thực
router.post('/run-code', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ message: 'Code và language là bắt buộc' });
    }
    
    const containerInfo = await containerService.processCode(code, language);
    
    res.status(200).json({
      message: 'Code đã được chạy thành công',
      containerInfo
    });
  } catch (error) {
    console.error('Error running code:', error);
    res.status(500).json({ message: 'Lỗi server khi chạy code', error: error.message });
  }
});

module.exports = router;
