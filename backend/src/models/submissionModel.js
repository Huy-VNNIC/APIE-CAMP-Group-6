const { query } = require('../config/db');

const submissionModel = {
  // Tạo submission mới
  async create(studentId, resourceId, code) {
    const sql = `
      INSERT INTO student_submissions (student_id, resource_id, code, status)
      VALUES (?, ?, ?, 'pending')
    `;
    
    const result = await query(sql, [studentId, resourceId, code]);
    return { id: result.insertId };
  },
  
  // Cập nhật kết quả submission
  async updateResult(submissionId, result, status) {
    const sql = `
      UPDATE student_submissions
      SET result = ?, status = ?
      WHERE id = ?
    `;
    
    await query(sql, [result, status, submissionId]);
    return { success: true };
  },
  
  // Lấy lịch sử submissions của một student
  async getSubmissionsByStudent(studentId) {
    const sql = `
      SELECT 
        ss.id, 
        ss.resource_id, 
        lr.title as resource_title, 
        lr.type as resource_type,
        ss.code, 
        ss.result, 
        ss.status, 
        ss.submitted_at
      FROM student_submissions ss
      JOIN learning_resources lr ON ss.resource_id = lr.id
      WHERE ss.student_id = ?
      ORDER BY ss.submitted_at DESC
    `;
    
    return await query(sql, [studentId]);
  },
  
  // Lấy chi tiết một submission
  async getSubmissionById(id) {
    const sql = `
      SELECT 
        ss.id, 
        ss.student_id, 
        ss.resource_id, 
        lr.title as resource_title,
        lr.type as resource_type,
        ss.code, 
        ss.result, 
        ss.status, 
        ss.submitted_at
      FROM student_submissions ss
      JOIN learning_resources lr ON ss.resource_id = lr.id
      WHERE ss.id = ?
    `;
    
    const submissions = await query(sql, [id]);
    return submissions.length ? submissions[0] : null;
  }
};

module.exports = submissionModel;