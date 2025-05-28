const { query } = require('../config/db');

const resourceModel = {
  // Lấy tất cả learning resources
  async getAllResources() {
    const sql = `
      SELECT 
        lr.id, 
        lr.title, 
        lr.type, 
        lr.language, 
        lr.url, 
        u.name as created_by_name, 
        lr.created_at
      FROM learning_resources lr
      JOIN users u ON lr.created_by = u.id
      ORDER BY lr.created_at DESC
    `;
    
    return await query(sql);
  },
  
  // Lấy chi tiết một resource
  async getResourceById(id) {
    const sql = `
      SELECT 
        lr.id, 
        lr.title, 
        lr.type, 
        lr.language, 
        lr.url, 
        u.name as created_by_name, 
        lr.created_at
      FROM learning_resources lr
      JOIN users u ON lr.created_by = u.id
      WHERE lr.id = ?
    `;
    
    const resources = await query(sql, [id]);
    return resources.length ? resources[0] : null;
  },
  
  // Lấy tài liệu theo loại
  async getResourcesByType(type) {
    const sql = `
      SELECT 
        lr.id, 
        lr.title, 
        lr.type, 
        lr.language, 
        lr.url, 
        u.name as created_by_name, 
        lr.created_at
      FROM learning_resources lr
      JOIN users u ON lr.created_by = u.id
      WHERE lr.type = ?
      ORDER BY lr.created_at DESC
    `;
    
    return await query(sql, [type]);
  }
};

module.exports = resourceModel;