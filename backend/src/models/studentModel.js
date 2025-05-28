const { pool } = require('../config/database');
const logger = require('../utils/logger');

class StudentModel {
  /**
   * Get student profile by user ID
   * @param {number} userId - User ID
   * @returns {Object|null} - Student profile or null
   */
  static async getProfile(userId) {
    try {
      const [studentRows] = await pool.execute(
        'SELECT * FROM students WHERE user_id = ?',
        [userId]
      );
      
      if (!studentRows.length) {
        return null;
      }
      
      const [userRows] = await pool.execute(
        'SELECT id, name, email, role, verified, created_at FROM users WHERE id = ?',
        [userId]
      );
      
      if (!userRows.length) {
        return null;
      }
      
      const student = studentRows[0];
      const user = userRows[0];
      
      return {
        ...user,
        dashboardData: student.dashboard_data ? JSON.parse(student.dashboard_data) : {},
      };
    } catch (error) {
      logger.error('Error getting student profile:', error);
      throw error;
    }
  }

  /**
   * Update student dashboard data
   * @param {number} userId - User ID
   * @param {Object} dashboardData - Dashboard data
   * @returns {boolean} - Success status
   */
  static async updateDashboardData(userId, dashboardData) {
    try {
      const [result] = await pool.execute(
        'UPDATE students SET dashboard_data = ? WHERE user_id = ?',
        [JSON.stringify(dashboardData), userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('Error updating student dashboard data:', error);
      throw error;
    }
  }

  /**
   * Get student progress
   * @param {number} userId - User ID
   * @returns {Object} - Student progress
   */
  static async getProgress(userId) {
    try {
      // Get student dashboard data
      const [studentRows] = await pool.execute(
        'SELECT dashboard_data FROM students WHERE user_id = ?',
        [userId]
      );
      
      if (!studentRows.length) {
        return { progress: 0, completedResources: [] };
      }
      
      const dashboardData = JSON.parse(studentRows[0].dashboard_data || '{}');
      
      // Get completed submissions
      const [submissionRows] = await pool.execute(
        'SELECT resource_id FROM student_submissions WHERE student_id = ? AND status = "success" GROUP BY resource_id',
        [userId]
      );
      
      const completedResources = submissionRows.map(row => row.resource_id);
      
      // Get total resources count
      const [resourceCountRows] = await pool.execute(
        'SELECT COUNT(*) as total FROM learning_resources'
      );
      
      const totalResources = resourceCountRows[0].total;
      const progress = totalResources > 0 ? (completedResources.length / totalResources) * 100 : 0;
      
      return {
        progress: Math.round(progress),
        completedResources,
        ...dashboardData
      };
    } catch (error) {
      logger.error('Error getting student progress:', error);
      throw error;
    }
  }
}

module.exports = StudentModel;