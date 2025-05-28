// Phần này chèn vào app.js sau các middleware và trước các routes

// Import modules
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục public tồn tại
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Lưu swagger spec dưới dạng JSON file
fs.writeFileSync(
  path.join(publicDir, 'swagger.json'),
  JSON.stringify(swaggerSpec)
);

// Cấu hình Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestDuration: true,
  }
}));

// Cung cấp swagger.json file
app.get('/swagger.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/swagger.json'));
});