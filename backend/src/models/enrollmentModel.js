const db = require('../config/db');

class Enrollment {
  static async enroll(studentId, courseId) {
    try {
      const query = `
        INSERT INTO enrollments (student_id, course_id)
        VALUES ($1, $2)
        RETURNING *
      `;
      const result = await db.query(query, [studentId, courseId]);
      return result.rows[0];
    } catch (error) {
      // Xử lý lỗi trùng lặp enrollment
      if (error.code === '23505') { // Unique violation
        throw new Error('Bạn đã đăng ký khóa học này rồi');
      }
      throw error;
    }
  }

  static async getEnrollmentsByStudent(studentId) {
    const query = `
      SELECT e.*, c.title, c.description, c.difficulty_level
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.student_id = $1
      ORDER BY e.enrollment_date DESC
    `;
    const result = await db.query(query, [studentId]);
    return result.rows;
  }

  static async updateCompletionStatus(enrollmentId, studentId, completed) {
    const query = `
      UPDATE enrollments
      SET completed = $1
      WHERE enrollment_id = $2 AND student_id = $3
      RETURNING *
    `;
    const result = await db.query(query, [completed, enrollmentId, studentId]);
    return result.rows[0];
  }

  static async unenroll(studentId, courseId) {
    const query = `
      DELETE FROM enrollments
      WHERE student_id = $1 AND course_id = $2
      RETURNING *
    `;
    const result = await db.query(query, [studentId, courseId]);
    return result.rows[0];
  }

  static async isEnrolled(studentId, courseId) {
    const query = `
      SELECT * FROM enrollments
      WHERE student_id = $1 AND course_id = $2
    `;
    const result = await db.query(query, [studentId, courseId]);
    return result.rows.length > 0;
  }
}

module.exports = Enrollment;
