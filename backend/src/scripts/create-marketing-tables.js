require('dotenv').config();
const { sequelize } = require('../config/database');
const User = require('../models/User');
const AdsCampaign = require('../models/AdsCampaign');
const CampaignRecipient = require('../models/CampaignRecipient');
const EmailTemplate = require('../models/EmailTemplate');

async function createMarketingTables() {
  try {
    console.log('Creating marketing tables...');
    
    // Tạo bảng
    await sequelize.sync({ alter: true });
    
    console.log('Checking for marketing user...');
    
    // Kiểm tra xem đã có user marketing chưa
    let marketingUser = await User.findOne({
      where: {
        role: 'marketing'
      }
    });
    
    // Tạo user marketing nếu chưa có
    if (!marketingUser) {
      console.log('Creating marketing user...');
      
      marketingUser = await User.create({
        name: 'Marketing Manager',
        email: 'marketing@example.com',
        password_hash: '$2a$10$g8xIJ5hEt2KF0qBKBXECCOCaVpZUMG6KKrJRCLz.XzYMFmKHRoRQO', // marketing123
        role: 'marketing',
        verified: true
      });
      
      console.log('Marketing user created');
    }
    
    // Kiểm tra xem đã có template mẫu chưa
    const templateCount = await EmailTemplate.count();
    
    if (templateCount === 0) {
      console.log('Creating sample email templates...');
      
      // Tạo template welcome
      await EmailTemplate.create({
        name: 'Welcome Email',
        subject: 'Welcome to Coding Platform',
        content: `
          <h2>Welcome {{name}}!</h2>
          <p>Thank you for joining our platform. We're excited to have you with us!</p>
          <p>Here are some quick links to get you started:</p>
          <ul>
            <li><a href="{{dashboardUrl}}">Your Dashboard</a></li>
            <li><a href="{{coursesUrl}}">Browse Courses</a></li>
            <li><a href="{{resourcesUrl}}">Learning Resources</a></li>
          </ul>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Happy coding!</p>
        `,
        created_by: marketingUser.id,
        is_default: true
      });
      
      // Tạo template course announcement
      await EmailTemplate.create({
        name: 'New Course Announcement',
        subject: 'New Course Available: {{courseName}}',
        content: `
          <h2>New Course Alert!</h2>
          <p>Hello {{name}},</p>
          <p>We're excited to announce a new course: <strong>{{courseName}}</strong></p>
          <p>{{courseDescription}}</p>
          <p><a href="{{courseUrl}}" class="button">View Course</a></p>
          <p>Enrollment is now open. Don't miss this opportunity to enhance your skills!</p>
        `,
        created_by: marketingUser.id,
        is_default: false
      });
      
      // Tạo template newsletter
      await EmailTemplate.create({
        name: 'Monthly Newsletter',
        subject: 'Coding Platform - Monthly Newsletter',
        content: `
          <h2>Monthly Newsletter - {{month}} {{year}}</h2>
          <p>Hello {{name}},</p>
          <p>Here's what's new this month:</p>
          <h3>New Courses</h3>
          <p>{{newCourses}}</p>
          <h3>Platform Updates</h3>
          <p>{{platformUpdates}}</p>
          <h3>Community Highlights</h3>
          <p>{{communityHighlights}}</p>
          <p>Keep coding and learning!</p>
        `,
        created_by: marketingUser.id,
        is_default: false
      });
      
      console.log('Sample email templates created');
    }
    
    // Kiểm tra xem đã có campaign mẫu chưa
    const campaignCount = await AdsCampaign.count();
    
    if (campaignCount === 0) {
      console.log('Creating sample campaign...');
      
      // Tạo campaign mẫu
      const sampleCampaign = await AdsCampaign.create({
        created_by: marketingUser.id,
        title: 'Welcome to Our Platform',
        content: `
          <h2>Welcome to Coding Platform!</h2>
          <p>Hello {{name}},</p>
          <p>We're excited to have you join our growing community of learners and developers.</p>
          <p>Our platform offers:</p>
          <ul>
            <li>Interactive coding exercises</li>
            <li>Expert-led video tutorials</li>
            <li>Comprehensive resources for all skill levels</li>
            <li>Supportive community forums</li>
          </ul>
          <p>Start your learning journey today!</p>
          <p><a href="https://example.com/dashboard" class="button">Go to Dashboard</a></p>
        `,
        target_roles: ['student', 'instructor'],
        campaign_type: 'email',
        status: 'draft'
      });
      
      // Tìm vài user để thêm vào danh sách người nhận
      const users = await User.findAll({
        where: {
          role: ['student', 'instructor']
        },
        limit: 5
      });
      
      if (users.length > 0) {
        const recipients = users.map(user => ({
          campaign_id: sampleCampaign.id,
          user_id: user.id,
          status: 'pending'
        }));
        
        await CampaignRecipient.bulkCreate(recipients);
      }
      
      console.log('Sample campaign created');
    }
    
    console.log('Marketing tables and sample data created successfully');
  } catch (error) {
    console.error('Error creating marketing tables:', error);
  } finally {
    process.exit();
  }
}

createMarketingTables();