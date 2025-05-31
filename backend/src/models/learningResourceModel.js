const db = require('../config/db');

class LearningResource {
  static async getResourcesByCourse(courseId) {
    const query = `
      SELECT * FROM learning_resources
      WHERE course_id = $1
      ORDER BY created_at
    `;
    const result = await db.query(query, [courseId]);
    return result.rows;
  }

  static async getResourceById(resourceId) {
    const query = `
      SELECT * FROM learning_resources
      WHERE resource_id = $1
    `;
    const result = await db.query(query, [resourceId]);
    return result.rows[0];
  }

  static async getResourcesForStudent(studentId, courseId) {
    // Kiểm tra student có đăng ký khóa học này không
    const enrollmentQuery = `
      SELECT * FROM enrollments
      WHERE student_id = $1 AND course_id = $2
    `;
    const enrollmentResult = await db.query(enrollmentQuery, [studentId, courseId]);
    
    if (enrollmentResult.rows.length === 0) {
      throw new Error('Bạn chưa đăng ký khóa học này');
    }
    
    // Lấy tất cả tài liệu học tập của khóa học
    const resourcesQuery = `
      SELECT * FROM learning_resources
      WHERE course_id = $2
      ORDER BY created_at
    `;
    const resourcesResult = await db.query(resourcesQuery, [studentId, courseId]);
    return resourcesResult.rows;
  }
}

module.exports = LearningResource;
