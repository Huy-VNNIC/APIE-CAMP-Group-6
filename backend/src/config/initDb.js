const { sequelize } = require('./database');
const logger = require('../utils/logger');
const User = require('../models/User');
const Student = require('../models/Student');
const AdsCampaign = require('../models/AdsCampaign');
const CampaignRecipient = require('../models/CampaignRecipient');
const EmailTemplate = require('../models/EmailTemplate');
const LearningResource = require('../models/LearningResource');
const StudentSubmission = require('../models/StudentSubmission');
const Ticket = require('../models/Ticket');
const bcrypt = require('bcryptjs');

const initDb = async () => {
  try {
    // Đồng bộ tất cả các model với database
    await sequelize.sync({ alter: true });
    logger.info('Database synchronized successfully');

    // Kiểm tra nếu đã có dữ liệu, nếu chưa thì thêm dữ liệu mẫu
    const userCount = await User.count();
    
    if (userCount === 0) {
      logger.info('Initializing database with sample data...');
      
      // Hash mật khẩu
      const salt = await bcrypt.genSalt(10);
      const adminPasswordHash = await bcrypt.hash('admin123', salt);
      const userPasswordHash = await bcrypt.hash('user123', salt);
      
      // Tạo user admin
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password_hash: adminPasswordHash,
        role: 'admin',
        verified: true
      });
      
      // Tạo user marketing
      const marketingUser = await User.create({
        name: 'Marketing Manager',
        email: 'marketing@example.com',
        password_hash: userPasswordHash,
        role: 'marketing',
        verified: true
      });
      
      // Tạo user student
      const studentUser = await User.create({
        name: 'Student User',
        email: 'student@example.com',
        password_hash: userPasswordHash,
        role: 'student',
        verified: true
      });
      
      // Tạo student profile
      await Student.create({
        user_id: studentUser.id,
        dashboard_data: {
          points: 50,
          level: 2,
          completed_resources: 5,
          badges: ['First Submission', 'Quick Learner'],
          recent_activities: [],
          preferences: {
            theme: 'light',
            editor_font_size: 14,
            editor_tab_size: 2,
            auto_save: true
          }
        }
      });
      
      // Tạo email templates
      const welcomeTemplate = await EmailTemplate.create({
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
      
      // Tạo campaign mẫu
      const welcomeCampaign = await AdsCampaign.create({
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
        target_roles: ['student'],
        campaign_type: 'email',
        status: 'draft'
      });
      
      // Thêm recipient
      await CampaignRecipient.create({
        campaign_id: welcomeCampaign.id,
        user_id: studentUser.id,
        status: 'pending'
      });
      
      // Tạo learning resources
      const jsResource = await LearningResource.create({
        title: 'JavaScript Fundamentals',
        type: 'video',
        language: 'javascript',
        url: 'https://example.com/videos/js-fundamentals',
        created_by: adminUser.id
      });
      
      const pythonResource = await LearningResource.create({
        title: 'Python for Beginners',
        type: 'code',
        language: 'python',
        url: 'https://example.com/tutorials/python-beginners',
        created_by: adminUser.id
      });
      
      // Tạo submissions
      await StudentSubmission.create({
        student_id: studentUser.id,
        resource_id: pythonResource.id,
        code: 'print("Hello, World!")',
        result: JSON.stringify({
          output: "Hello, World!",
          executionTime: "120ms",
          memory: "45MB"
        }),
        status: 'success',
        submitted_at: new Date()
      });
      
      // Tạo ticket hỗ trợ
      await Ticket.create({
        user_id: studentUser.id,
        subject: 'Question about JavaScript course',
        message: 'I have a question about the JavaScript fundamentals course. Can you provide more examples?',
        status: 'open',
        created_at: new Date()
      });
      
      logger.info('Sample data initialized successfully');
    }
    
    return true;
  } catch (error) {
    logger.error(`Database initialization error: ${error.message}`);
    return false;
  }
};

module.exports = initDb;