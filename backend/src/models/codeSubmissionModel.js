const db = require('../config/db');

class CodeSubmission {
  static async createSubmission(submissionData) {
    const { studentId, courseId, resourceId, codeText, language } = submissionData;

    const query = `
      INSERT INTO code_submissions 
      (student_id, course_id, resource_id, code_text, language, status)
      VALUES ($1, $2, $3, $4, $5, 'submitted')
      RETURNING *
    `;
    
    const values = [studentId, courseId, resourceId, codeText, language];
    const result = await db.query(query, values);
    
    return result.rows[0];
  }

  static async getSubmissionsByStudent(studentId) {
    const query = `
      SELECT cs.*, c.title as course_title, lr.title as resource_title
      FROM code_submissions cs
      JOIN courses c ON cs.course_id = c.course_id
      JOIN learning_resources lr ON cs.resource_id = lr.resource_id
      WHERE cs.student_id = $1
      ORDER BY cs.submitted_at DESC
    `;
    
    const result = await db.query(query, [studentId]);
    return result.rows;
  }

  static async getSubmissionById(submissionId, studentId) {
    const query = `
      SELECT cs.*, c.title as course_title, lr.title as resource_title
      FROM code_submissions cs
      JOIN courses c ON cs.course_id = c.course_id
      JOIN learning_resources lr ON cs.resource_id = lr.resource_id
      WHERE cs.submission_id = $1 AND cs.student_id = $2
    `;
    
    const result = await db.query(query, [submissionId, studentId]);
    return result.rows[0];
  }

  static async updateSubmissionResult(submissionId, result, status) {
    const query = `
      UPDATE code_submissions
      SET result = $2, status = $3
      WHERE submission_id = $1
      RETURNING *
    `;
    
    const queryResult = await db.query(query, [submissionId, result, status]);
    return queryResult.rows[0];
  }
  
  // Lấy tất cả code submissions cho một resource
  static async getSubmissionsByResource(resourceId) {
    const query = `
      SELECT cs.*, u.username, u.full_name
      FROM code_submissions cs
      JOIN users u ON cs.student_id = u.user_id
      WHERE cs.resource_id = $1
      ORDER BY cs.submitted_at DESC
    `;
    
    const result = await db.query(query, [resourceId]);
    return result.rows;
  }
  
  // Lấy các submissions mới nhất cho từng resource trong một khóa học
  static async getLatestSubmissionsByStudentAndCourse(studentId, courseId) {
    const query = `
      SELECT DISTINCT ON (cs.resource_id) 
        cs.*, 
        lr.title as resource_title, 
        lr.type as resource_type
      FROM code_submissions cs
      JOIN learning_resources lr ON cs.resource_id = lr.resource_id
      WHERE cs.student_id = $1 AND cs.course_id = $2
      ORDER BY cs.resource_id, cs.submitted_at DESC
    `;
    
    const result = await db.query(query, [studentId, courseId]);
    return result.rows;
  }
}

module.exports = CodeSubmission;