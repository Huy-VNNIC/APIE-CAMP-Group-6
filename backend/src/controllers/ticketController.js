const ticketModel = require('../models/ticketModel');

const ticketController = {
  // Tạo ticket mới
  async createTicket(req, res) {
    try {
      const { subject, message } = req.body;
      const userId = req.user.id;
      
      const ticket = await ticketModel.create(userId, subject, message);
      
      res.status(201).json({
        success: true,
        data: {
          id: ticket.id,
          subject,
          message,
          status: 'open',
          created_at: new Date()
        }
      });
    } catch (err) {
      console.error('Create ticket error:', err);
      res.status(500).json({
        success: false,
        msg: 'Server error'
      });
    }
  },
  
  // Lấy danh sách tickets
  async getTickets(req, res) {
    try {
      const userId = req.user.id;
      const tickets = await ticketModel.getTicketsByUser(userId);
      
      res.json({
        success: true,
        data: tickets
      });
    } catch (err) {
      console.error('Get tickets error:', err);
      res.status(500).json({
        success: false,
        msg: 'Server error'
      });
    }
  },
  
  // Lấy chi tiết ticket
  async getTicketById(req, res) {
    try {
      const ticketId = req.params.id;
      const ticket = await ticketModel.getTicketWithResponses(ticketId);
      
      if (!ticket) {
        return res.status(404).json({
          success: false,
          msg: 'Ticket not found'
        });
      }
      
      // Kiểm tra xem ticket có phải của user này không
      if (ticket.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          msg: 'Not authorized to view this ticket'
        });
      }
      
      res.json({
        success: true,
        data: ticket
      });
    } catch (err) {
      console.error('Get ticket error:', err);
      res.status(500).json({
        success: false,
        msg: 'Server error'
      });
    }
  },
  
  // Thêm phản hồi cho ticket (student)
  async addStudentResponse(req, res) {
    try {
      const ticketId = req.params.id;
      const { message } = req.body;
      const userId = req.user.id;
      
      // Kiểm tra xem ticket có tồn tại không
      const ticket = await ticketModel.getTicketWithResponses(ticketId);
      
      if (!ticket) {
        return res.status(404).json({
          success: false,
          msg: 'Ticket not found'
        });
      }
      
      // Kiểm tra xem ticket có phải của user này không
      if (ticket.user_id !== userId) {
        return res.status(403).json({
          success: false,
          msg: 'Not authorized to respond to this ticket'
        });
      }
      
      // Thêm response
      const response = await ticketModel.addResponse(ticketId, userId, message);
      
      res.status(201).json({
        success: true,
        data: {
          id: response.id,
          message,
          responded_at: new Date()
        }
      });
    } catch (err) {
      console.error('Add response error:', err);
      res.status(500).json({
        success: false,
        msg: 'Server error'
      });
    }
  }
};

module.exports = ticketController;