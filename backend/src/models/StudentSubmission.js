const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Student = require('./Student');
const LearningResource = require('./LearningResource');

const StudentSubmission = sequelize.define('StudentSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'students',
      key: 'user_id'
    }
  },
  resource_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'learning_resources',
      key: 'id'
    }
  },
  code: {
    type: DataTypes.TEXT
  },
  result: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed'),
    defaultValue: 'pending'
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'student_submissions',
  timestamps: false
});

// Thiết lập mối quan hệ
StudentSubmission.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(StudentSubmission, { foreignKey: 'student_id' });

StudentSubmission.belongsTo(LearningResource, { foreignKey: 'resource_id' });
LearningResource.hasMany(StudentSubmission, { foreignKey: 'resource_id' });

module.exports = StudentSubmission;
