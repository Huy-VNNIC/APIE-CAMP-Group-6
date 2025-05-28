const { pool } = require('../config/database');
const logger = require('../utils/logger');

class SubmissionModel {
  /**
   * Create a new code submission
   * @param {Object} submissionData - Submission data
   * @returns {Object} - Created submission
   */
  static async create(submissionData) {
    try {
      const { student_id, resource_id, code, result, status } = submissionData;
      
      const [result1] = await pool.execute(
        'INSERT INTO student_submissions (student_id, resource_id, code, result, status) VALUES (?, ?, ?, ?, ?)',
        [student_id, resource_id, code, result, status]
      );
      
      if (result1.affectedRows === 0) {
        throw new Error('Failed to create submission');
      }
      
      return this.getById(result1.insertId);
    } catch (error) {
      logger.error('Error creating submission:', error);
      throw error;
    }
  }

  /**
   * Get submission by ID
   * @param {number} id - Submission ID
   * @returns {Object|null} - Submission object or null
   */
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM student_submissions WHERE id = ?',
        [id]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Error getting submission by ID:', error);
      throw error;
    }
  }

  /**
   * Get all submissions for a student
   * @param {number} studentId - Student ID
   * @returns {Array} - List of submissions
   */
  static async getByStudentId(studentId) {
    try {
      const [rows] = await pool.execute(
        `SELECT s.*, r.title as resource_title 
         FROM student_submissions s
         JOIN learning_resources r ON s.resource_id = r.id
         WHERE s.student_id = ?
         ORDER BY s.submitted_at DESC`,
        [studentId]
      );
      
      return rows;
    } catch (error) {
      logger.error('Error getting submissions by student ID:', error);
      throw error;
    }
  }

  /**
   * Get all submissions for a specific resource
   * @param {number} studentId - Student ID
   * @param {number} resourceId - Resource ID
   * @returns {Array} - List of submissions
   */
  static async getByResourceId(studentId, resourceId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM student_submissions WHERE student_id = ? AND resource_id = ? ORDER BY submitted_at DESC',
        [studentId, resourceId]
      );
      
      return rows;
    } catch (error) {
      logger.error('Error getting submissions by resource ID:', error);
      throw error;
    }
  }

  /**
   * Update submission status
   * @param {number} id - Submission ID
   * @param {string} status - New status
   * @param {string} result - Execution result
   * @returns {boolean} - Success status
   */
  static async updateStatus(id, status, result) {
    try {
      const [updateResult] = await pool.execute(
        'UPDATE student_submissions SET status = ?, result = ? WHERE id = ?',
        [status, result, id]
      );
      
      return updateResult.affectedRows > 0;
    } catch (error) {
      logger.error('Error updating submission status:', error);
      throw error;
    }
  }
}

module.exports = SubmissionModel;