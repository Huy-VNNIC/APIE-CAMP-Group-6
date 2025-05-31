const SupportTicket = require('../models/supportTicketModel');

exports.createTicket = async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    const userId = req.user.id;
    
    // Kiểm tra các trường bắt buộc
    if (!subject || !description) {
      return res.status(400).json({ message: 'Thiếu thông tin ticket' });
    }
    
    // Tạo ticket mới
    const ticket = await SupportTicket.createTicket({
      userId,
      subject,
      description,
      priority
    });
    
    res.status(201).json({
      message: 'Tạo yêu cầu hỗ trợ thành công',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await SupportTicket.getTicketsByUser(userId);
    
    res.status(200).json({
      tickets
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getTicketDetail = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;
    
    const ticket = await SupportTicket.getTicketById(ticketId, userId);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu hỗ trợ' });
    }
    
    res.status(200).json({
      ticket
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.addResponse = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { responseText } = req.body;
    const userId = req.user.id;
    
    if (!responseText) {
      return res.status(400).json({ message: 'Nội dung phản hồi không được để trống' });
    }
    
    // Kiểm tra ticket tồn tại và thuộc về user
    const ticket = await SupportTicket.getTicketById(ticketId, userId);
    if (!ticket) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu hỗ trợ' });
    }
    
    // Thêm phản hồi
    const response = await SupportTicket.addResponse({
      ticketId,
      userId,
      responseText
    });
    
    res.status(201).json({
      message: 'Thêm phản hồi thành công',
      response
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
