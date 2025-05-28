const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const LearningResource = sequelize.define('LearningResource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255)
  },
  type: {
    type: DataTypes.ENUM('video', 'slide', 'ebook', 'code')
  },
  language: {
    type: DataTypes.STRING(50)
  },
  url: {
    type: DataTypes.TEXT
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'learning_resources',
  timestamps: false
});

// Thiết lập mối quan hệ với User
LearningResource.belongsTo(User, { foreignKey: 'created_by', as: 'User' });
User.hasMany(LearningResource, { foreignKey: 'created_by' });

module.exports = LearningResource;
