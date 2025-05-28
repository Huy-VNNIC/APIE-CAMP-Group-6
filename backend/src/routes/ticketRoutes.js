const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth');

// Tất cả routes đều yêu cầu xác thực
router.use(auth);

// Tạo ticket mới
router.post('/', ticketController.createTicket);

// Lấy danh sách tickets
router.get('/', ticketController.getTickets);

// Lấy chi tiết ticket
router.get('/:id', ticketController.getTicketById);

// Thêm phản hồi cho ticket
router.post('/:id/responses', ticketController.addStudentResponse);

module.exports = router;