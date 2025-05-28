const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Tạo transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Tạo thư mục templates nếu chưa tồn tại
const templateDir = path.join(__dirname, '../templates');
if (!fs.existsSync(templateDir)) {
  fs.mkdirSync(templateDir, { recursive: true });
}

// Load template mặc định
const defaultTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{subject}}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #3498db; color: white; padding: 10px 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { font-size: 12px; text-align: center; margin-top: 30px; color: #777; }
    .button { display: inline-block; background-color: #3498db; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{title}}</h1>
    </div>
    <div class="content">
      {{{content}}}
    </div>
    <div class="footer">
      <p>© {{year}} Coding Platform. All rights reserved.</p>
      <p>If you don't want to receive these emails, you can <a href="{{unsubscribeUrl}}">unsubscribe</a>.</p>
    </div>
  </div>
</body>
</html>
`;

// Tạo file template mặc định nếu chưa tồn tại
const defaultTemplatePath = path.join(templateDir, 'default.html');
if (!fs.existsSync(defaultTemplatePath)) {
  fs.writeFileSync(defaultTemplatePath, defaultTemplate);
}

// Compile template
const compileTemplate = (templateContent, data) => {
  try {
    const template = Handlebars.compile(templateContent);
    return template(data);
  } catch (error) {
    logger.error(`Error compiling email template: ${error.message}`);
    return data.content; // Fallback to plain content
  }
};

// Gửi email đơn
const sendEmail = async (to, subject, content, templateName = 'default') => {
  try {
    // Load template
    let templateContent;
    const templatePath = path.join(templateDir, `${templateName}.html`);
    
    if (fs.existsSync(templatePath)) {
      templateContent = fs.readFileSync(templatePath, 'utf8');
    } else {
      templateContent = defaultTemplate;
    }
    
    // Dữ liệu cho template
    const data = {
      subject,
      title: subject,
      content,
      year: new Date().getFullYear(),
      unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe`
    };
    
    // Render template
    const html = compileTemplate(templateContent, data);
    
    // Gửi email
    const result = await transporter.sendMail({
      from: `"Coding Platform" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });
    
    logger.info(`Email sent to ${to}: ${result.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    return false;
  }
};

// Gửi email hàng loạt
const sendBulkEmails = async (recipients, subject, content, templateName = 'default') => {
  try {
    const results = {
      total: recipients.length,
      sent: 0,
      failed: 0,
      details: []
    };
    
    // Load template
    let templateContent;
    const templatePath = path.join(templateDir, `${templateName}.html`);
    
    if (fs.existsSync(templatePath)) {
      templateContent = fs.readFileSync(templatePath, 'utf8');
    } else {
      templateContent = defaultTemplate;
    }
    
    // Gửi email cho từng người
    for (const recipient of recipients) {
      try {
        // Thay thế biến trong content
        let personalizedContent = content;
        Object.keys(recipient).forEach(key => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          personalizedContent = personalizedContent.replace(regex, recipient[key]);
        });
        
        // Dữ liệu cho template
        const data = {
          subject,
          title: subject,
          content: personalizedContent,
          year: new Date().getFullYear(),
          unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(recipient.email)}`
        };
        
        // Render template
        const html = compileTemplate(templateContent, data);
        
        // Gửi email
        const result = await transporter.sendMail({
          from: `"Coding Platform" <${process.env.EMAIL_FROM}>`,
          to: recipient.email,
          subject,
          html
        });
        
        results.sent++;
        results.details.push({
          email: recipient.email,
          status: 'sent',
          messageId: result.messageId
        });
      } catch (error) {
        logger.error(`Error sending email to ${recipient.email}: ${error.message}`);
        
        results.failed++;
        results.details.push({
          email: recipient.email,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    return results;
  } catch (error) {
    logger.error(`Error in sendBulkEmails: ${error.message}`);
    throw error;
  }
};

// Kiểm tra kết nối email
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    logger.info('Email service connection verified');
    return true;
  } catch (error) {
    logger.error(`Email service connection failed: ${error.message}`);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmails,
  verifyEmailConnection
};