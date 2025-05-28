const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const AdsCampaign = require('./AdsCampaign');
const User = require('./User');

const CampaignRecipient = sequelize.define('CampaignRecipient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ads_campaigns',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'opened', 'clicked', 'bounced'),
    defaultValue: 'pending'
  },
  sent_at: {
    type: DataTypes.DATE
  },
  opened_at: {
    type: DataTypes.DATE
  },
  clicked_at: {
    type: DataTypes.DATE
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
  tableName: 'campaign_recipients',
  timestamps: false
});

// Thiết lập mối quan hệ
CampaignRecipient.belongsTo(AdsCampaign, { foreignKey: 'campaign_id' });
AdsCampaign.hasMany(CampaignRecipient, { foreignKey: 'campaign_id' });

CampaignRecipient.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(CampaignRecipient, { foreignKey: 'user_id' });

module.exports = CampaignRecipient;