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
}

module.exports = CodeSubmission;
