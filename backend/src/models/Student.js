const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Student = sequelize.define('Student', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  dashboard_data: {
    type: DataTypes.JSON,
    defaultValue: {
      points: 0,
      level: 1,
      completed_resources: 0,
      badges: [],
      recent_activities: [],
      preferences: {
        theme: 'light',
        editor_font_size: 14,
        editor_tab_size: 2,
        auto_save: true
      }
    }
  }
}, {
  tableName: 'students',
  timestamps: false
});

// Thiết lập mối quan hệ với User
Student.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Student;