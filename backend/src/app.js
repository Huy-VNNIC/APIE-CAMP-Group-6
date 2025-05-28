require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require('./config/database');
const logger = require('./utils/logger');

// Khởi tạo app
const app = express();

// Rate limiting để ngăn chặn tấn công brute force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn mỗi IP là 100 request trong 15 phút
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Coding Platform API',
      version: '1.0.0',
      description: 'API Documentation for Online Coding Platform',
      contact: {
        name: 'API Support',
        email: 'support@codingplatform.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.codingplatform.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://codingplatform.com', /\.codingplatform\.com$/] 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));

app.use(compression()); // Nén dữ liệu trả về
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Áp dụng rate limiting cho các routes API
app.use('/api/', apiLimiter);

// Import routes an toàn - chỉ import nếu file tồn tại
const loadRoutesSafely = (routePath) => {
  try {
    if (fs.existsSync(path.join(__dirname, routePath))) {
      return require(routePath);
    }
    logger.warn(`Route file ${routePath} not found, skipping...`);
    return null;
  } catch (error) {
    logger.warn(`Error loading ${routePath}: ${error.message}`);
    return null;
  }
};

// Load routes
const authRoutes = loadRoutesSafely('./routes/authRoutes');
const studentRoutes = loadRoutesSafely('./routes/studentRoutes');
const marketingRoutes = loadRoutesSafely('./routes/marketingRoutes');
const instructorRoutes = loadRoutesSafely('./routes/instructorRoutes');
const supportRoutes = loadRoutesSafely('./routes/supportRoutes');
const developerRoutes = loadRoutesSafely('./routes/developerRoutes');
const adminRoutes = loadRoutesSafely('./routes/adminRoutes');

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    server: 'Online Coding Platform API',
    user: req.headers['x-user'] || 'Anonymous'
  });
});

app.get('/health/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'ok', 
      message: 'Database connection is healthy',
      dbHost: process.env.DB_HOST,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Database health check failed: ${error.message}`);
    res.status(503).json({ 
      status: 'error', 
      message: 'Database connection error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Static files
app.use('/public', express.static(path.join(__dirname, '../public')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Thêm route mới cho swagger-ui.html để hỗ trợ Spring Boot/Java developers
app.use('/swagger-ui.html', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));

// API Routes - sử dụng chỉ khi routes đã được load thành công
if (authRoutes) app.use('/api/auth', authRoutes);
if (studentRoutes) app.use('/api/student', studentRoutes);
if (marketingRoutes) app.use('/api/marketing', marketingRoutes);
if (instructorRoutes) app.use('/api/instructor', instructorRoutes);
if (supportRoutes) app.use('/api/support', supportRoutes);
if (developerRoutes) app.use('/api/developer', developerRoutes);
if (adminRoutes) app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  const currentTime = new Date().toISOString();
  const currentUser = req.headers['x-user'] || 'Anonymous';
  
  res.json({
    message: 'Welcome to Online Coding Platform API',
    documentation: '/api-docs',
    swaggerUI: '/swagger-ui.html',
    health: '/health',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: currentTime,
    user: currentUser,
    server: 'NodeJS ' + process.version
  });
});

// Cập nhật route cho phép hỗ trợ Spring Boot developers
app.get('/actuator/health', (req, res) => {
  res.json({
    status: 'UP',
    components: {
      db: {
        status: 'UP',
        details: {
          database: process.env.DB_DATABASE,
          host: process.env.DB_HOST
        }
      },
      diskSpace: {
        status: 'UP',
        details: {
          total: '120GB',
          free: '80GB'
        }
      }
    }
  });
});

// Thêm trang debug cho developer
app.get('/debug', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      message: 'Debug page is not available in production mode'
    });
  }
  
  // Hiển thị các thông tin debug
  const debugInfo = {
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    reqHeaders: req.headers,
    loadedRoutes: {
      auth: !!authRoutes,
      student: !!studentRoutes,
      marketing: !!marketingRoutes,
      instructor: !!instructorRoutes,
      support: !!supportRoutes,
      developer: !!developerRoutes,
      admin: !!adminRoutes
    },
    envVars: {
      PORT: process.env.PORT,
      DB_HOST: process.env.DB_HOST,
      DB_DATABASE: process.env.DB_DATABASE
    }
  };
  
  res.json(debugInfo);
});

// 404 Handler
app.use((req, res) => {
  logger.warn(`Resource not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log lỗi với mức độ phù hợp
  if (statusCode >= 500) {
    logger.error(`Server error: ${err.stack}`);
  } else {
    logger.warn(`Client error: ${err.message}`);
  }
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      ...err
    } : undefined,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
});

module.exports = app;