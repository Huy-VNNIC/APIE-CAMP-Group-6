const db = require('../config/db');

class Course {
  static async getAllCourses() {
    const query = `
      SELECT c.*, u.username as instructor_name,
      COUNT(DISTINCT e.student_id) as student_count
      FROM courses c
      LEFT JOIN users u ON c.created_by = u.user_id
      LEFT JOIN enrollments e ON c.course_id = e.course_id
      GROUP BY c.course_id, u.username
      ORDER BY c.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getCourseById(id) {
    const query = `
      SELECT c.*, u.username as instructor_name,
      COUNT(DISTINCT e.student_id) as student_count
      FROM courses c
      LEFT JOIN users u ON c.created_by = u.user_id
      LEFT JOIN enrollments e ON c.course_id = e.course_id
      WHERE c.course_id = $1
      GROUP BY c.course_id, u.username
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getCoursesForStudent(studentId) {
    const query = `
      SELECT c.*, u.username as instructor_name, 
      e.enrollment_date, e.completed, e.enrollment_id
      FROM courses c
      JOIN enrollments e ON c.course_id = e.course_id
      LEFT JOIN users u ON c.created_by = u.user_id
      WHERE e.student_id = $1
      ORDER BY e.enrollment_date DESC
    `;
    const result = await db.query(query, [studentId]);
    return result.rows;
  }

  static async getAvailableCoursesForStudent(studentId) {
    const query = `
      SELECT c.*, u.username as instructor_name
      FROM courses c
      LEFT JOIN users u ON c.created_by = u.user_id
      WHERE c.course_id NOT IN (
        SELECT course_id FROM enrollments WHERE student_id = $1
      )
      ORDER BY c.created_at DESC
    `;
    const result = await db.query(query, [studentId]);
    return result.rows;
  }
}

module.exports = Course;
