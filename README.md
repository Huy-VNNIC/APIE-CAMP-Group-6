# Online Coding Platform

A comprehensive online programming learning platform with interactive learning features, exercises, assessments, and live coding sessions.

## 🏗️ System Architecture

The platform is built on a distributed architecture across two VPS servers:

- **VPS 1 (202.249.25.210)**: `oncode` - Web Server (Node.js, Express, React)
- **VPS 2 (202.249.25.211)**: `oncodedb` - Database Server (PostgreSQL in Docker)

## 👥 User Roles & Permissions

### 1. **Student**
- Register for courses and learning paths
- Access learning materials and documentation
- Complete coding exercises and assignments
- Submit code solutions for evaluation
- Participate in live coding sessions
- Track personal learning progress
- Take quizzes and assessments

### 2. **Instructor**
- Create and manage courses
- Develop learning materials and curricula
- Design coding exercises and projects
- Create quizzes and assessments
- Host live coding sessions
- Monitor student progress and performance
- Provide feedback and grading

### 3. **Support**
- Handle user support requests
- Resolve technical issues
- Answer student and instructor queries
- Manage platform documentation
- Assist with account management

### 4. **Marketing**
- Create marketing campaigns
- Manage promotional content
- Analyze user engagement metrics
- Develop outreach strategies
- Handle partnerships and collaborations

### 5. **Developer**
- System administration and maintenance
- Implement CI/CD pipelines
- Database management and optimization
- Security updates and monitoring
- Performance optimization
- Feature development and bug fixes

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16+ recommended)
- **Docker** and **Docker Compose**
- **Git**
- **SSH** access to both VPS servers

### VPS 2 - Database Server Setup (oncodedb)

#### 1. Initial Server Setup

```bash
# Connect to VPS 2
ssh root@202.249.25.211

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create workspace directory
mkdir -p ~/Huy-workspace/online-coding-platform
cd ~/Huy-workspace/online-coding-platform
```

#### 2. Clone and Setup Database

```bash
# Clone the repository
git clone https://github.com/your-repo/online-coding-platform.git .

# Navigate to postgres-docker directory
cd postgres-docker

# Create necessary directories
mkdir -p data config init logs backups

# Set proper permissions
sudo chown -R $USER:$USER data logs backups
chmod 755 config init
```

#### 3. Database Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Example .env file:**
```env
POSTGRES_DB=online_coding_platform
POSTGRES_USER=oncode_admin
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_PORT=5432
PGDATA=/var/lib/postgresql/data/pgdata

# Backup settings
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30

# Monitoring
POSTGRES_LOG_LEVEL=INFO
MAX_CONNECTIONS=200
SHARED_BUFFERS=256MB
```

#### 4. Start Database Services

```bash
# Start PostgreSQL container
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs -f postgres

# Test database connection
./test-connection.sh
```

#### 5. Database Initialization

```bash
# Run initial database setup
docker-compose exec postgres psql -U oncode_admin -d online_coding_platform -f /docker-entrypoint-initdb.d/01-init-schema.sql

# Import sample data (optional)
docker-compose exec postgres psql -U oncode_admin -d online_coding_platform -f /docker-entrypoint-initdb.d/02-sample-data.sql

# Verify tables were created
docker-compose exec postgres psql -U oncode_admin -d online_coding_platform -c "\dt"
```

### VPS 1 - Web Server Setup (oncode)

#### 1. Initial Server Setup

```bash
# Connect to VPS 1
ssh root@202.249.25.210

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Create workspace directory
mkdir -p ~/Huy-workspace/online-coding-platform
cd ~/Huy-workspace/online-coding-platform
```

#### 2. Clone and Setup Web Server

```bash
# Clone the repository
git clone https://github.com/your-repo/online-coding-platform.git .

# Navigate to web-server directory
cd web-server

# Install dependencies
npm install

# Install development dependencies (if needed)
npm install --only=dev
```

#### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Example .env file:**
```env
# Server Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database Configuration
DB_HOST=202.249.25.211
DB_PORT=5432
DB_NAME=online_coding_platform
DB_USER=oncode_admin
DB_PASSWORD=your_secure_password_here
DB_SSL=true
DB_POOL_MIN=2
DB_POOL_MAX=20

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your_session_secret_here
SESSION_MAX_AGE=86400000

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_app_password

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=js,py,java,cpp,c,html,css,sql

# Redis Configuration (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Live Session Configuration
WEBSOCKET_PORT=3001
MAX_SESSION_PARTICIPANTS=50

# Security Configuration
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=https://your-domain.com

# Logging Configuration
LOG_LEVEL=info
LOG_MAX_FILES=5
LOG_MAX_SIZE=20m
```

#### 4. Database Connection Test

```bash
# Test database connectivity
node src/test-db-connection.js

# Expected output:
# ✅ Database connection successful
# ✅ All required tables exist
# 📊 Database statistics: X tables, Y total records
```

#### 5. Build and Start Application

```bash
# Build the React frontend
npm run build

# Start the application in development mode
npm run dev

# Or start in production mode with PM2
npm run start:prod

# Check PM2 processes
pm2 list

# View application logs
pm2 logs online-coding-platform

# Monitor application
pm2 monit
```

## 📁 Detailed Directory Structure

```
Huy-workspace/online-coding-platform/
├── README.md
├── .gitignore
├── docker-compose.yml
│
├── postgres-docker/                    # Database Server (VPS 2)
│   ├── config/
│   │   ├── postgresql.conf             # PostgreSQL main configuration
│   │   ├── pg_hba.conf                # Authentication configuration
│   │   └── pg_ident.conf              # User mapping configuration
│   │
│   ├── data/                          # PostgreSQL data directory
│   │   └── pgdata/                    # Actual database files
│   │
│   ├── init/                          # Database initialization scripts
│   │   ├── 01-init-schema.sql         # Create tables and schema
│   │   ├── 02-sample-data.sql         # Sample data for development
│   │   ├── 03-create-indexes.sql      # Database indexes
│   │   └── 04-create-functions.sql    # Stored procedures/functions
│   │
│   ├── logs/                          # PostgreSQL logs
│   ├── backups/                       # Database backups
│   ├── scripts/
│   │   ├── backup.sh                  # Backup script
│   │   ├── restore.sh                 # Restore script
│   │   └── test-connection.sh         # Connection test script
│   │
│   ├── docker-compose.yml             # Docker configuration
│   ├── Dockerfile                     # Custom PostgreSQL image
│   └── .env                          # Environment variables
│
└── web-server/                        # Web Application (VPS 1)
    ├── public/                        # Static files
    │   ├── index.html
    │   ├── favicon.ico
    │   └── assets/
    │
    ├── src/
    │   ├── components/                # React components
    │   │   ├── common/               # Shared components
    │   │   ├── auth/                 # Authentication components
    │   │   ├── courses/              # Course-related components
    │   │   ├── exercises/            # Exercise components
    │   │   ├── live-sessions/        # Live coding session components
    │   │   └── dashboard/            # Dashboard components
    │   │
    │   ├── pages/                    # React pages/routes
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── CoursePage.jsx
    │   │   ├── ExercisePage.jsx
    │   │   └── LiveSessionPage.jsx
    │   │
    │   ├── hooks/                    # Custom React hooks
    │   ├── contexts/                 # React contexts
    │   ├── utils/                    # Frontend utilities
    │   ├── styles/                   # CSS/SCSS files
    │   ├── assets/                   # Images, fonts, etc.
    │   │
    │   ├── server/                   # Backend server code
    │   │   ├── config/
    │   │   │   ├── database.js       # Database configuration
    │   │   │   ├── server.js         # Server configuration
    │   │   │   ├── auth.js           # Authentication config
    │   │   │   └── websocket.js      # WebSocket configuration
    │   │   │
    │   │   ├── controllers/          # Route controllers
    │   │   │   ├── authController.js
    │   │   │   ├── userController.js
    │   │   │   ├── courseController.js
    │   │   │   ├── exerciseController.js
    │   │   │   ├── quizController.js
    │   │   │   └── liveSessionController.js
    │   │   │
    │   │   ├── middleware/           # Express middleware
    │   │   │   ├── auth.js           # Authentication middleware
    │   │   │   ├── validation.js     # Input validation
    │   │   │   ├── errorHandler.js   # Error handling
    │   │   │   ├── rateLimit.js      # Rate limiting
    │   │   │   └── cors.js           # CORS configuration
    │   │   │
    │   │   ├── models/               # Database models
    │   │   │   ├── User.js
    │   │   │   ├── Course.js
    │   │   │   ├── Exercise.js
    │   │   │   ├── Quiz.js
    │   │   │   ├── Submission.js
    │   │   │   └── LiveSession.js
    │   │   │
    │   │   ├── routes/               # API routes
    │   │   │   ├── auth.js
    │   │   │   ├── users.js
    │   │   │   ├── courses.js
    │   │   │   ├── exercises.js
    │   │   │   ├── quizzes.js
    │   │   │   └── live-sessions.js
    │   │   │
    │   │   ├── services/             # Business logic services
    │   │   │   ├── authService.js
    │   │   │   ├── userService.js
    │   │   │   ├── courseService.js
    │   │   │   ├── exerciseService.js
    │   │   │   ├── codeExecutionService.js
    │   │   │   └── liveSessionService.js
    │   │   │
    │   │   ├── utils/                # Backend utilities
    │   │   │   ├── logger.js         # Logging utility
    │   │   │   ├── email.js          # Email service
    │   │   │   ├── fileUpload.js     # File upload handling
    │   │   │   ├── codeRunner.js     # Code execution engine
    │   │   │   └── validation.js     # Validation schemas
    │   │   │
    │   │   ├── websocket/            # WebSocket handlers
    │   │   │   ├── liveSession.js    # Live session handlers
    │   │   │   ├── chat.js           # Chat functionality
    │   │   │   └── codeSharing.js    # Real-time code sharing
    │   │   │
    │   │   └── tests/                # Backend tests
    │   │       ├── unit/
    │   │       ├── integration/
    │   │       └── e2e/
    │   │
    │   ├── App.jsx                   # Main React application
    │   ├── index.js                  # Application entry point
    │   └── server.js                 # Express server entry point
    │
    ├── tests/                        # Frontend tests
    ├── docs/                         # Documentation
    ├── scripts/                      # Build and deployment scripts
    │   ├── build.sh
    │   ├── deploy.sh
    │   ├── backup.sh
    │   └── health-check.sh
    │
    ├── package.json                  # Node.js dependencies
    ├── package-lock.json
    ├── .env.example                  # Environment template
    ├── .env                         # Environment variables
    ├── .gitignore
    ├── webpack.config.js            # Webpack configuration
    ├── babel.config.js              # Babel configuration
    ├── eslint.config.js             # ESLint configuration
    └── pm2.config.js                # PM2 configuration
```

## 🚀 Running the Application

### Development Mode

```bash
# VPS 2 - Start database
cd ~/Huy-workspace/online-coding-platform/postgres-docker
docker-compose up -d

# VPS 1 - Start web server in development mode
cd ~/Huy-workspace/online-coding-platform/web-server
npm run dev
```

### Production Mode

```bash
# VPS 2 - Ensure database is running
docker-compose up -d

# VPS 1 - Start with PM2
npm run start:prod

# Setup automatic startup
pm2 startup
pm2 save
```

### Health Checks

```bash
# Check database health
cd postgres-docker && ./scripts/test-connection.sh

# Check web server health
curl http://202.249.25.210:3000/health

# Check all services
cd web-server && npm run health-check
```

## 🔧 Maintenance Commands

### Database Maintenance

```bash
# Create backup
cd postgres-docker && ./scripts/backup.sh

# Restore from backup
./scripts/restore.sh backup_filename.sql

# View database logs
docker-compose logs -f postgres

# Monitor database performance
docker-compose exec postgres psql -U oncode_admin -d online_coding_platform -c "SELECT * FROM pg_stat_activity;"
```

### Application Maintenance

```bash
# Update application
git pull origin main
npm install
npm run build
pm2 restart online-coding-platform

# View application logs
pm2 logs online-coding-platform

# Monitor resources
pm2 monit

# Check application status
pm2 status
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create new course (Instructor)
- `PUT /api/courses/:id` - Update course (Instructor)
- `DELETE /api/courses/:id` - Delete course (Instructor)

### Live Sessions
- `GET /api/live-sessions` - List active sessions
- `POST /api/live-sessions` - Create new session (Instructor)
- `POST /api/live-sessions/:id/join` - Join session
- `POST /api/live-sessions/:id/leave` - Leave session

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Secure session management

## 📊 Monitoring & Logging

- Application logs via Winston
- Database query logging
- Performance monitoring with PM2
- Error tracking and alerting
- Health check endpoints
- Resource usage monitoring

## 🛠️ Development Workflow

1. **Local Development**: Use `npm run dev` for hot reloading
2. **Testing**: Run `npm test` for unit and integration tests
3. **Building**: Use `npm run build` for production builds
4. **Deployment**: Use PM2 for process management
5. **Monitoring**: Check logs and metrics regularly

## 📝 Contributing

1. Create feature branch from `main`
2. Make changes and test locally
3. Run tests: `npm test`
4. Submit pull request
5. Deploy after review and approval

---

**Last Updated**: 2025-06-12 12:36:56 UTC  
**Maintained by**: Huy-VNNIC  
**Version**: 1.0.0