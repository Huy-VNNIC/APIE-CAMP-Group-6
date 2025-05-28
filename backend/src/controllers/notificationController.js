const db = require('../config/db');

module.exports = {
  // Lấy thông báo cho người dùng hiện tại
  getNotifications: async (req, res) => {
    try {
      const notifications = await db.query(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
        [req.user.id]
      );
      
      return res.json({
        success: true,
        data: notifications
      });
    } catch (err) {
      console.error('Get notifications error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching notifications',
        error: err.message
      });
    }
  },
  
  // Đánh dấu thông báo đã đọc
  markAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      
      await db.query(
        'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
        [notificationId, req.user.id]
      );
      
      return res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (err) {
      console.error('Mark notification read error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred',
        error: err.message
      });
    }
  },
  
  // Đánh dấu tất cả thông báo đã đọc
  markAllAsRead: async (req, res) => {
    try {
      await db.query(
        'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
        [req.user.id]
      );
      
      return res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (err) {
      console.error('Mark all notifications read error:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred',
        error: err.message
      });
    }
  },
  
  // Tiện ích tạo thông báo (sử dụng nội bộ)
  createNotification: async (userId, title, message, type = 'info') => {
    try {
      await db.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [userId, title, message, type]
      );
      
      return true;
    } catch (err) {
      console.error('Create notification error:', err);
      return false;
    }
  }
};