const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const AdsCampaign = sequelize.define('AdsCampaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  target_roles: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const value = this.getDataValue('target_roles');
      return value ? value.split(',') : [];
    },
    set(val) {
      if (Array.isArray(val)) {
        this.setDataValue('target_roles', val.join(','));
      } else {
        this.setDataValue('target_roles', val);
      }
    }
  },
  campaign_type: {
    type: DataTypes.ENUM('email', 'notification', 'banner'),
    defaultValue: 'email'
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'sent', 'canceled'),
    defaultValue: 'draft'
  },
  schedule_date: {
    type: DataTypes.DATE
  },
  sent_at: {
    type: DataTypes.DATE
  },
  metrics: {
    type: DataTypes.JSON,
    defaultValue: {
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ads_campaigns',
  timestamps: false
});

// Thiết lập mối quan hệ với User
AdsCampaign.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = AdsCampaign;