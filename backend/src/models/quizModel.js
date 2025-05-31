const db = require('../config/db');

class Quiz {
  static async getQuizzesByCourse(courseId) {
    const query = `
      SELECT * FROM quizzes
      WHERE course_id = $1
      ORDER BY created_at
    `;
    const result = await db.query(query, [courseId]);
    return result.rows;
  }

  static async getQuizById(quizId, withQuestions = false) {
    const quizQuery = `
      SELECT * FROM quizzes
      WHERE quiz_id = $1
    `;
    const quizResult = await db.query(quizQuery, [quizId]);
    const quiz = quizResult.rows[0];
    
    if (!quiz) return null;
    
    if (withQuestions) {
      const questionsQuery = `
        SELECT * FROM quiz_questions
        WHERE quiz_id = $1
        ORDER BY question_id
      `;
      const questionsResult = await db.query(questionsQuery, [quizId]);
      quiz.questions = questionsResult.rows;
      
      // Lấy options cho câu hỏi multiple choice
      for (const question of quiz.questions) {
        if (question.question_type === 'multiple_choice') {
          const optionsQuery = `
            SELECT * FROM quiz_options
            WHERE question_id = $1
            ORDER BY option_id
          `;
          const optionsResult = await db.query(optionsQuery, [question.question_id]);
          question.options = optionsResult.rows;
        }
      }
    }
    
    return quiz;
  }
  
  static async startQuizAttempt(studentId, quizId) {
    // Kiểm tra xem student đã có lần thử quiz này chưa
    const checkQuery = `
      SELECT * FROM quiz_attempts
      WHERE student_id = $1 AND quiz_id = $2
    `;
    const checkResult = await db.query(checkQuery, [studentId, quizId]);
    
    if (checkResult.rows.length > 0) {
      // Nếu có rồi thì cập nhật
      const updateQuery = `
        UPDATE quiz_attempts
        SET started_at = CURRENT_TIMESTAMP, completed_at = NULL, score = NULL
        WHERE student_id = $1 AND quiz_id = $2
        RETURNING *
      `;
      const updateResult = await db.query(updateQuery, [studentId, quizId]);
      return updateResult.rows[0];
    } else {
      // Nếu chưa có thì tạo mới
      const insertQuery = `
        INSERT INTO quiz_attempts (student_id, quiz_id)
        VALUES ($1, $2)
        RETURNING *
      `;
      const insertResult = await db.query(insertQuery, [studentId, quizId]);
      return insertResult.rows[0];
    }
  }
  
  static async completeQuizAttempt(studentId, quizId, score) {
    const query = `
      UPDATE quiz_attempts
      SET completed_at = CURRENT_TIMESTAMP, score = $3
      WHERE student_id = $1 AND quiz_id = $2
      RETURNING *
    `;
    const result = await db.query(query, [studentId, quizId, score]);
    return result.rows[0];
  }
  
  static async getQuizAttemptsByStudent(studentId) {
    const query = `
      SELECT qa.*, q.title as quiz_title, q.time_limit_minutes, c.title as course_title
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.quiz_id
      JOIN courses c ON q.course_id = c.course_id
      WHERE qa.student_id = $1
      ORDER BY qa.started_at DESC
    `;
    const result = await db.query(query, [studentId]);
    return result.rows;
  }
}

module.exports = Quiz;
