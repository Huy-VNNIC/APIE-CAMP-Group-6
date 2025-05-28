const { pool } = require('../config/database');
const logger = require('../utils/logger');

class ResourceModel {
  /**
   * Get all learning resources
   * @param {string} type - Resource type filter (optional)
   * @returns {Array} - List of resources
   */
  static async getAll(type = null) {
    try {
      let query = 'SELECT * FROM learning_resources';
      const params = [];
      
      if (type) {
        query += ' WHERE type = ?';
        params.push(type);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      logger.error('Error getting all resources:', error);
      throw error;
    }
  }

  /**
   * Get resource by ID
   * @param {number} id - Resource ID
   * @returns {Object|null} - Resource object or null
   */
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM learning_resources WHERE id = ?',
        [id]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Error getting resource by ID:', error);
      throw error;
    }
  }

  /**
   * Get resources by type
   * @param {string} type - Resource type
   * @returns {Array} - List of resources
   */
  static async getByType(type) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM learning_resources WHERE type = ? ORDER BY created_at DESC',
        [type]
      );
      
      return rows;
    } catch (error) {
      logger.error('Error getting resources by type:', error);
      throw error;
    }
  }

  /**
   * Search resources by title or content
   * @param {string} keyword - Search keyword
   * @returns {Array} - List of matching resources
   */
  static async search(keyword) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM learning_resources WHERE title LIKE ? ORDER BY created_at DESC',
        [`%${keyword}%`]
      );
      
      return rows;
    } catch (error) {
      logger.error('Error searching resources:', error);
      throw error;
    }
  }
}

module.exports = ResourceModel;