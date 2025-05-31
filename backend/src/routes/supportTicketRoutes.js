const express = require('express');
const ticketController = require('../controllers/supportTicketController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Yêu cầu đăng nhập (mọi vai trò đều có thể tạo ticket)
router.use(authMiddleware.protect);

// Tạo ticket mới
router.post('/tickets', ticketController.createTicket);

// Lấy danh sách ticket của mình
router.get('/my-tickets', ticketController.getMyTickets);

// Lấy chi tiết một ticket
router.get('/tickets/:ticketId', ticketController.getTicketDetail);

// Thêm phản hồi vào ticket
router.post('/tickets/:ticketId/responses', ticketController.addResponse);

module.exports = router;
