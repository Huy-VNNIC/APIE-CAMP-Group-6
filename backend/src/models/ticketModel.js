const { query } = require('../config/db');

const ticketModel = {
  // Tạo ticket mới
  async create(userId, subject, message) {
    const sql = `
      INSERT INTO tickets (user_id, subject, message)
      VALUES (?, ?, ?)
    `;
    
    const result = await query(sql, [userId, subject, message]);
    return { id: result.insertId };
  },
  
  // Lấy danh sách tickets của một user
  async getTicketsByUser(userId) {
    const sql = `
      SELECT 
        t.id, 
        t.subject, 
        t.message, 
        t.status, 
        t.created_at,
        (SELECT COUNT(*) FROM ticket_responses WHERE ticket_id = t.id) as response_count
      FROM tickets t
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
    `;
    
    return await query(sql, [userId]);
  },
  
  // Lấy chi tiết một ticket và các response
  async getTicketWithResponses(ticketId) {
    // Lấy thông tin ticket
    const ticketSql = `
      SELECT 
        t.id, 
        t.user_id, 
        t.subject, 
        t.message, 
        t.status, 
        t.created_at
      FROM tickets t
      WHERE t.id = ?
    `;
    
    const tickets = await query(ticketSql, [ticketId]);
    
    if (!tickets.length) {
      return null;
    }
    
    const ticket = tickets[0];
    
    // Lấy các responses
    const responsesSql = `
      SELECT 
        tr.id, 
        tr.support_user_id, 
        u.name as support_name,
        tr.message, 
        tr.responded_at
      FROM ticket_responses tr
      JOIN users u ON tr.support_user_id = u.id
      WHERE tr.ticket_id = ?
      ORDER BY tr.responded_at ASC
    `;
    
    const responses = await query(responsesSql, [ticketId]);
    
    return {
      ...ticket,
      responses
    };
  },
  
  // Thêm response cho ticket
  async addResponse(ticketId, supportUserId, message) {
    const sql = `
      INSERT INTO ticket_responses (ticket_id, support_user_id, message)
      VALUES (?, ?, ?)
    `;
    
    const result = await query(sql, [ticketId, supportUserId, message]);
    
    // Cập nhật trạng thái ticket thành 'in_progress'
    await query(
      'UPDATE tickets SET status = "in_progress" WHERE id = ?',
      [ticketId]
    );
    
    return { id: result.insertId };
  },
  
  // Cập nhật trạng thái ticket
  async updateStatus(ticketId, status) {
    const sql = `
      UPDATE tickets
      SET status = ?
      WHERE id = ?
    `;
    
    await query(sql, [status, ticketId]);
    return { success: true };
  }
};

module.exports = ticketModel;