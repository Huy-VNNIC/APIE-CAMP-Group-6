const db = require('../config/db');

class SupportTicket {
  static async createTicket(ticketData) {
    const { userId, subject, description, priority = 'medium' } = ticketData;
    
    const query = `
      INSERT INTO support_tickets 
      (user_id, subject, description, status, priority)
      VALUES ($1, $2, $3, 'open', $4)
      RETURNING *
    `;
    
    const values = [userId, subject, description, priority];
    const result = await db.query(query, values);
    
    return result.rows[0];
  }

  static async getTicketsByUser(userId) {
    const query = `
      SELECT t.*, u.username as assigned_to_name
      FROM support_tickets t
      LEFT JOIN users u ON t.assigned_to = u.user_id
      WHERE t.user_id = $1
      ORDER BY 
        CASE WHEN t.status = 'open' THEN 1
             WHEN t.status = 'in_progress' THEN 2
             WHEN t.status = 'resolved' THEN 3
             WHEN t.status = 'closed' THEN 4
        END,
        CASE WHEN t.priority = 'urgent' THEN 1
             WHEN t.priority = 'high' THEN 2
             WHEN t.priority = 'medium' THEN 3
             WHEN t.priority = 'low' THEN 4
        END,
        t.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getTicketById(ticketId, userId) {
    const ticketQuery = `
      SELECT t.*, u.username as assigned_to_name
      FROM support_tickets t
      LEFT JOIN users u ON t.assigned_to = u.user_id
      WHERE t.ticket_id = $1 AND t.user_id = $2
    `;
    
    const ticketResult = await db.query(ticketQuery, [ticketId, userId]);
    const ticket = ticketResult.rows[0];
    
    if (ticket) {
      // Lấy các response cho ticket
      const responsesQuery = `
        SELECT r.*, u.username, u.role
        FROM ticket_responses r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.ticket_id = $1
        ORDER BY r.created_at
      `;
      
      const responsesResult = await db.query(responsesQuery, [ticketId]);
      ticket.responses = responsesResult.rows;
    }
    
    return ticket;
  }

  static async addResponse(responseData) {
    const { ticketId, userId, responseText } = responseData;
    
    const query = `
      INSERT INTO ticket_responses 
      (ticket_id, user_id, response_text)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await db.query(query, [ticketId, userId, responseText]);
    
    // Cập nhật trạng thái ticket nếu người trả lời là support hoặc developer
    const userQuery = `
      SELECT role FROM users WHERE user_id = $1
    `;
    const userResult = await db.query(userQuery, [userId]);
    const userRole = userResult.rows[0]?.role;
    
    if (userRole === 'support' || userRole === 'developer') {
      await db.query(
        `UPDATE support_tickets SET status = 'in_progress' WHERE ticket_id = $1 AND status = 'open'`,
        [ticketId]
      );
    }
    
    return result.rows[0];
  }
}

module.exports = SupportTicket;
