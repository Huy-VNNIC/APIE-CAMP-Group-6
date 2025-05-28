const { Op } = require('sequelize');
const User = require('../models/User');
const AdsCampaign = require('../models/AdsCampaign');
const CampaignRecipient = require('../models/CampaignRecipient');
const EmailTemplate = require('../models/EmailTemplate');
const { sequelize } = require('../config/database');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_app_password'
  }
});

// 1. Lấy danh sách chiến dịch
exports.getCampaigns = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause.title = { [Op.like]: `%${search}%` };
    }
    
    const campaigns = await AdsCampaign.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: {
        campaigns: campaigns.rows,
        pagination: {
          total: campaigns.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(campaigns.count / limit)
        }
      }
    });
  } catch (error) {
    logger.error(`Error fetching campaigns: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching campaigns',
      error: error.message
    });
  }
};

// 2. Lấy chi tiết chiến dịch
exports.getCampaignDetails = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const campaign = await AdsCampaign.findByPk(campaignId, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: CampaignRecipient,
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'email', 'role']
            }
          ]
        }
      ]
    });
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Lấy thống kê người nhận
    const recipientStats = await CampaignRecipient.findAll({
      where: { campaign_id: campaignId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });
    
    const stats = {
      total: 0,
      pending: 0,
      sent: 0,
      opened: 0,
      clicked: 0,
      bounced: 0
    };
    
    recipientStats.forEach(stat => {
      const count = parseInt(stat.get('count'));
      stats[stat.status] = count;
      stats.total += count;
    });
    
    res.json({
      success: true,
      data: {
        campaign,
        stats
      }
    });
  } catch (error) {
    logger.error(`Error fetching campaign details: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching campaign details',
      error: error.message
    });
  }
};

// 3. Tạo chiến dịch mới
exports.createCampaign = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      title,
      content,
      targetRoles,
      campaignType = 'email',
      scheduleDate
    } = req.body;
    
    // Validate dữ liệu đầu vào
    if (!title || !content || !targetRoles || !Array.isArray(targetRoles) || targetRoles.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Invalid campaign data. Please provide title, content and target roles'
      });
    }
    
    // Tạo chiến dịch mới
    const campaign = await AdsCampaign.create({
      created_by: req.user.id,
      title,
      content,
      target_roles: targetRoles,
      campaign_type: campaignType,
      status: scheduleDate ? 'scheduled' : 'draft',
      schedule_date: scheduleDate ? new Date(scheduleDate) : null
    }, { transaction });
    
    // Tìm người dùng phù hợp với targetRoles
    const targetUsers = await User.findAll({
      where: {
        role: { [Op.in]: targetRoles }
      },
      attributes: ['id'],
      transaction
    });
    
    // Tạo danh sách người nhận
    if (targetUsers.length > 0) {
      const recipients = targetUsers.map(user => ({
        campaign_id: campaign.id,
        user_id: user.id,
        status: 'pending'
      }));
      
      await CampaignRecipient.bulkCreate(recipients, { transaction });
    }
    
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: {
        campaign,
        recipientCount: targetUsers.length
      }
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error creating campaign: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating campaign',
      error: error.message
    });
  }
};

// 4. Cập nhật chiến dịch
exports.updateCampaign = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { campaignId } = req.params;
    const {
      title,
      content,
      targetRoles,
      campaignType,
      status,
      scheduleDate
    } = req.body;
    
    // Tìm chiến dịch
    const campaign = await AdsCampaign.findByPk(campaignId, { transaction });
    
    if (!campaign) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Kiểm tra quyền chỉnh sửa
    if (campaign.created_by !== req.user.id && req.user.role !== 'admin') {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this campaign'
      });
    }
    
    // Không cho phép cập nhật chiến dịch đã gửi
    if (campaign.status === 'sent') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot update campaign that has already been sent'
      });
    }
    
    // Cập nhật thông tin chiến dịch
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (campaignType) updateData.campaign_type = campaignType;
    if (status) updateData.status = status;
    if (scheduleDate) updateData.schedule_date = new Date(scheduleDate);
    
    await campaign.update(updateData, { transaction });
    
    // Cập nhật targetRoles nếu có
    if (targetRoles && Array.isArray(targetRoles) && targetRoles.length > 0) {
      campaign.target_roles = targetRoles;
      await campaign.save({ transaction });
      
      // Xóa người nhận cũ
      await CampaignRecipient.destroy({
        where: { campaign_id: campaignId },
        transaction
      });
      
      // Tìm người dùng mới
      const targetUsers = await User.findAll({
        where: {
          role: { [Op.in]: targetRoles }
        },
        attributes: ['id'],
        transaction
      });
      
      // Tạo danh sách người nhận mới
      if (targetUsers.length > 0) {
        const recipients = targetUsers.map(user => ({
          campaign_id: campaign.id,
          user_id: user.id,
          status: 'pending'
        }));
        
        await CampaignRecipient.bulkCreate(recipients, { transaction });
      }
    }
    
    await transaction.commit();
    
    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: {
        campaign
      }
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error updating campaign: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating campaign',
      error: error.message
    });
  }
};

// 5. Gửi chiến dịch
exports.sendCampaign = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { campaignId } = req.params;
    
    // Tìm chiến dịch
    const campaign = await AdsCampaign.findByPk(campaignId, {
      transaction,
      include: [
        {
          model: CampaignRecipient,
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });
    
    if (!campaign) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Kiểm tra quyền gửi
    if (campaign.created_by !== req.user.id && req.user.role !== 'admin') {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to send this campaign'
      });
    }
    
    // Kiểm tra trạng thái
    if (campaign.status === 'sent') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Campaign has already been sent'
      });
    }
    
    // Kiểm tra có người nhận không
    if (!campaign.CampaignRecipients || campaign.CampaignRecipients.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'No recipients for this campaign'
      });
    }
    
    // Cập nhật trạng thái chiến dịch
    await campaign.update({
      status: 'sent',
      sent_at: new Date()
    }, { transaction });
    
    // Trong thực tế, việc gửi email sẽ được xử lý bằng queue
    // Ở đây chúng ta sẽ mô phỏng việc gửi
    const sentCount = campaign.CampaignRecipients.length;
    
    // Cập nhật trạng thái người nhận
    await CampaignRecipient.update(
      {
        status: 'sent',
        sent_at: new Date()
      },
      {
        where: { campaign_id: campaignId },
        transaction
      }
    );
    
    // Cập nhật metrics
    await campaign.update({
      metrics: {
        ...campaign.metrics,
        sent: sentCount
      }
    }, { transaction });
    
    await transaction.commit();
    
    // Gửi email trong background (không đồng bộ)
    sendEmails(campaign, campaign.CampaignRecipients).catch(err => {
      logger.error(`Error sending emails: ${err.message}`);
    });
    
    res.json({
      success: true,
      message: 'Campaign is being sent',
      data: {
        sentAt: campaign.sent_at,
        recipientCount: sentCount
      }
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error sending campaign: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error sending campaign',
      error: error.message
    });
  }
};

// 6. Xóa chiến dịch
exports.deleteCampaign = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { campaignId } = req.params;
    
    // Tìm chiến dịch
    const campaign = await AdsCampaign.findByPk(campaignId, { transaction });
    
    if (!campaign) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Kiểm tra quyền xóa
    if (campaign.created_by !== req.user.id && req.user.role !== 'admin') {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this campaign'
      });
    }
    
    // Không cho phép xóa chiến dịch đã gửi
    if (campaign.status === 'sent') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot delete campaign that has already been sent'
      });
    }
    
    // Xóa tất cả người nhận
    await CampaignRecipient.destroy({
      where: { campaign_id: campaignId },
      transaction
    });
    
    // Xóa chiến dịch
    await campaign.destroy({ transaction });
    
    await transaction.commit();
    
    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error deleting campaign: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting campaign',
      error: error.message
    });
  }
};

// 7. Lấy danh sách template
exports.getEmailTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    logger.error(`Error fetching email templates: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching email templates',
      error: error.message
    });
  }
};

// 8. Tạo template mới
exports.createEmailTemplate = async (req, res) => {
  try {
    const { name, subject, content, isDefault } = req.body;
    
    // Validate dữ liệu đầu vào
    if (!name || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, subject and content'
      });
    }
    
    // Tạo template mới
    const template = await EmailTemplate.create({
      name,
      subject,
      content,
      created_by: req.user.id,
      is_default: isDefault || false
    });
    
    // Nếu là mặc định, cập nhật các template khác
    if (isDefault) {
      await EmailTemplate.update(
        { is_default: false },
        {
          where: {
            id: { [Op.ne]: template.id }
          }
        }
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Email template created successfully',
      data: template
    });
  } catch (error) {
    logger.error(`Error creating email template: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating email template',
      error: error.message
    });
  }
};

// 9. Lấy số liệu thống kê
exports.getMarketingStats = async (req, res) => {
  try {
    // Tổng số chiến dịch
    const totalCampaigns = await AdsCampaign.count();
    
    // Chiến dịch theo trạng thái
    const campaignsByStatus = await AdsCampaign.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });
    
    // Tính tỷ lệ mở email
    const recipientStats = await CampaignRecipient.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });
    
    const stats = {
      totalCampaigns,
      campaignsByStatus: {},
      recipients: {
        total: 0,
        sent: 0,
        opened: 0,
        clicked: 0,
        openRate: 0,
        clickRate: 0
      }
    };
    
    campaignsByStatus.forEach(item => {
      stats.campaignsByStatus[item.status] = parseInt(item.get('count'));
    });
    
    let sentCount = 0;
    let openedCount = 0;
    let clickedCount = 0;
    
    recipientStats.forEach(item => {
      const count = parseInt(item.get('count'));
      stats.recipients.total += count;
      
      if (item.status === 'sent') {
        sentCount = count;
        stats.recipients.sent = count;
      } else if (item.status === 'opened') {
        openedCount = count;
        stats.recipients.opened = count;
      } else if (item.status === 'clicked') {
        clickedCount = count;
        stats.recipients.clicked = count;
      }
    });
    
    if (sentCount > 0) {
      stats.recipients.openRate = parseFloat(((openedCount / sentCount) * 100).toFixed(2));
      stats.recipients.clickRate = parseFloat(((clickedCount / sentCount) * 100).toFixed(2));
    }
    
    // Chiến dịch gần đây
    const recentCampaigns = await AdsCampaign.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 5
    });
    
    res.json({
      success: true,
      data: {
        stats,
        recentCampaigns
      }
    });
  } catch (error) {
    logger.error(`Error fetching marketing stats: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching marketing stats',
      error: error.message
    });
  }
};

// Hàm hỗ trợ gửi email
async function sendEmails(campaign, recipients) {
  try {
    for (const recipient of recipients) {
      try {
        // Chuẩn bị nội dung email
        const user = recipient.User;
        
        // Thay thế các biến trong nội dung
        const personalizedContent = campaign.content
          .replace(/{{name}}/g, user.name)
          .replace(/{{email}}/g, user.email);
        
        // Gửi email
        await transporter.sendMail({
          from: `"Coding Platform" <${process.env.EMAIL_FROM || 'noreply@coding-platform.com'}>`,
          to: user.email,
          subject: campaign.title,
          html: personalizedContent
        });
        
        // Cập nhật trạng thái đã gửi
        await recipient.update({ status: 'sent', sent_at: new Date() });
        
      } catch (error) {
        logger.error(`Error sending email to ${recipient.User.email}: ${error.message}`);
        
        // Đánh dấu là bị bounce
        await recipient.update({ status: 'bounced' });
      }
    }
  } catch (error) {
    logger.error(`Error in sendEmails: ${error.message}`);
    throw error;
  }
}