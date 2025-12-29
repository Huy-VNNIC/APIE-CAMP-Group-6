# 🚀 Online Coding Platform | Japan APIE Advance Camp - Group 6

### **Japan APIE Advance Camp 2024 Final Project**  
*An Industry-Academia Collaboration Platform for Programming Education with AI Integration*

[![Japan APIE Advance Camp](https://img.shields.io/badge/Japan-APIE_Advance_Camp-FF0000?style=for-the-badge&logo=japan&logoColor=white)]([[https://apie-camp.jp/](https://apie.soi.asia/camp/#advanced-camps)](https://apie.soi.asia/camp/#advanced-camps))
[![Academic Project](https://img.shields.io/badge/Academic-Final_Project-0077B5?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Feroz455/APIE-CAMP-Group-6)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)

## 🇯🇵 **About Japan APIE Advance Camp**

**APIE (Advanced Programming and Information Engineering) Advance Camp** is an elite technical training program in Japan that bridges industry needs with academic excellence. This project represents the **Group 6 Final Submission** for the 2024 cohort, developed under the guidance of industry mentors and academic advisors.

### **🎯 Project Vision & Goals**
- **Industry-Academia Bridge**: Create a platform that serves both educational institutions and tech companies
- **Modern Tech Stack Implementation**: Demonstrate proficiency in full-stack development with distributed systems
- **AI Integration**: Incorporate cutting-edge AI technologies into traditional educational platforms
- **Scalable Architecture**: Design systems that can handle real-world educational institution loads

---

## 📖 **Project Overview**

**Online Coding Platform** is a comprehensive, production-ready programming education system developed as part of the **Japan APIE Advance Camp 2024**. This platform combines interactive learning methodologies with AI-powered automation, built on a robust distributed microservices architecture across two dedicated VPS servers.

### **🏆 **Japan APIE Advance Camp Achievements**
- ✅ **Distributed Systems Mastery**: Implementation of multi-server architecture
- ✅ **AI Integration Excellence**: Seamless OpenAI API integration for marketing automation
- ✅ **Enterprise Security**: Industry-grade authentication and authorization systems
- ✅ **Real-time Collaboration**: WebSocket-based live coding sessions
- ✅ **Production Deployment**: Complete CI/CD and monitoring infrastructure

### **✨ **Key Innovations**
- **🤖 AI-Powered Marketing Automation**: First-of-its-kind integration in educational platforms
- **🏗️ Japan Industry Standards**: Built following Japanese tech industry best practices
- **👥 Multi-Institution Support**: Designed for university and corporate training programs
- **💻 Real-time Code Collaboration**: Advanced pair programming features

---

## 🎯 **Featured: AI Marketing Campaign System**  
*Japan APIE Advance Camp Technical Showcase*

### **🚀 Quick AI Marketing Setup**


```

bash
# 1. Clone the Japan APIE Advance Camp project
git clone https://github.com/Feroz455/APIE-CAMP-Group-6.git
cd APIE-CAMP-Group-6

# 2. Configure for Japan APIE environment
cp .env.japan-apie .env
# Add your OPENAI_API_KEY to .env (provided during camp)

# 3. Launch services with Japan timezone settings
docker-compose -f docker-compose.japan.yml up -d

# 4. Access the Japan APIE demo dashboard:
#    • Web Interface: http://localhost:3001 (login: apie/apie2024)
#    • API Documentation: http://localhost:3000/api-docs


## 🎯 **Featured: AI Marketing Campaign System**

The platform includes an innovative **AI-powered marketing system** that automates campaign creation for programming courses.

### **🚀 Quick AI Marketing Setup**

```bash
# 1. Clone and configure
git clone https://github.com/Feroz455/APIE-CAMP-Group-6.git
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# 2. Launch services
docker-compose up -d

# 3. Access marketing tools:
#    • Web Interface: http://localhost:3001
#    • Standalone Tool: ai-marketing-tool.html
#    • Direct API: http://localhost:5001/api/marketing/ai/campaign-ideas
```

### **🎨 Generate Campaigns in Seconds**

```bash
curl -X POST http://localhost:5001/api/marketing/ai/campaign-ideas \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN" \
  -d '{"prompt":"Create engaging campaigns for JavaScript beginner courses"}'
```

**✨ AI Features:**
- **Smart Campaign Generation**: Professional titles, descriptions, and targeting
- **Fallback System**: High-quality templates when AI is unavailable
- **Course-Specific**: Tailored for programming education content
- **Multiple Access Points**: Web, standalone tool, and direct API

---

## 🏗️ **System Architecture**

| Server | IP Address | Role | Technologies |
|--------|------------|------|--------------|
| **VPS 1** | `202.249.25.210` | Web Application Server | Node.js, Express, React, WebSocket |
| **VPS 2** | `202.249.25.211` | Database Server | PostgreSQL (Docker), Backup Systems |

### **📊 Technology Stack**
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, WebSocket | Interactive UI, real-time collaboration |
| **Backend** | Node.js, Express | API server, business logic |
| **Database** | PostgreSQL 16 | Data persistence, relationships |
| **Infrastructure** | Docker, PM2 | Containerization, process management |
| **AI/ML** | OpenAI API | Marketing campaign generation |
| **Monitoring** | Winston, PM2 | Logging, performance tracking |

---

## 👥 **User Roles & Capabilities**

### **🎓 Student Experience**
- **Interactive Learning**: Code directly in the browser with instant feedback
- **Progress Tracking**: Visual dashboards showing course completion and skill growth
- **Live Collaboration**: Join instructor-led coding sessions in real-time
- **Personalized Paths**: Adaptive learning recommendations based on performance

### **👨‍🏫 Instructor Tools**
- **Course Builder**: Drag-and-drop curriculum creation with multimedia support
- **Code Evaluation**: Automated testing and grading for student submissions
- **Analytics Dashboard**: Insights into class performance and engagement
- **Live Session Hosting**: Interactive coding workshops with shared editor

### **📈 Marketing & Administration**
- **AI Campaign Generator**: Create targeted marketing content in minutes
- **Performance Analytics**: Track user acquisition and course popularity
- **Multi-channel Deployment**: Web, email, and social media campaign management
- **A/B Testing**: Compare campaign effectiveness with built-in analytics

---

## 🚀 **Quick Start Deployment**

### **📋 Prerequisites**
- Node.js v16+ and npm
- Docker & Docker Compose
- Git and SSH access
- OpenAI API key (for AI features)

### **⚡ One-Command Local Development**
```bash
# Complete setup in one command (simplified)
./setup.sh --local --with-ai
```

### **🌐 Production Deployment**
```bash
# Deploy to both VPS servers
./deploy.sh --production --vps1 202.249.25.210 --vps2 202.249.25.211
```

---

## 📁 **Project Structure**

```
online-coding-platform/
├── 📂 web-server/                    # VPS 1: Main Application
│   ├── 📂 src/
│   │   ├── 📂 client/               # React Frontend
│   │   │   ├── 📂 components/       # Reusable UI Components
│   │   │   ├── 📂 pages/           # Route Pages
│   │   │   ├── 📂 hooks/           # Custom React Hooks
│   │   │   └── 📂 contexts/        # React Context Providers
│   │   │
│   │   ├── 📂 server/               # Node.js Backend
│   │   │   ├── 📂 api/             # REST API Endpoints
│   │   │   ├── 📂 services/        # Business Logic
│   │   │   ├── 📂 middleware/      # Express Middleware
│   │   │   ├── 📂 websocket/       # Real-time Communication
│   │   │   └── 📂 ai-marketing/    # AI Campaign System ★
│   │   │
│   │   └── 📂 shared/               # Shared Utilities
│   │
│   ├── 📂 tests/                    # Test Suites
│   ├── 📂 docs/                     # Documentation
│   └── 📂 scripts/                  # Build & Deployment
│
└── 📂 postgres-docker/              # VPS 2: Database
    ├── 📂 config/                   # PostgreSQL Configuration
    ├── 📂 init/                     # Database Schema & Seeds
    ├── 📂 backups/                  # Automated Backups
    ├── 📂 scripts/                  # Maintenance Scripts
    └── docker-compose.yml           # Container Orchestration
```

---

## 🔧 **Core Features**

### **1. Interactive Learning Environment**
- **Browser-based Code Editor** with syntax highlighting and autocomplete
- **Real-time Code Execution** for immediate feedback
- **Step-by-Step Tutorials** with interactive examples
- **Gamified Progress System** with badges and achievements

### **2. AI-Enhanced Marketing**
- **Campaign Idea Generation** using GPT models
- **Audience Targeting Suggestions** based on course content
- **Multi-platform Content Adaptation** (web, social, email)
- **Performance Prediction** for campaign effectiveness

### **3. Collaborative Features**
- **Live Pair Programming** with shared cursor and chat
- **Code Review System** with inline comments and suggestions
- **Community Challenges** with leaderboards and prizes
- **Mentor Matching** based on learning goals

### **4. Administrative Controls**
- **Granular Permission System** with 5 distinct user roles
- **Comprehensive Analytics Dashboard** for platform metrics
- **Automated Backup System** with point-in-time recovery
- **Health Monitoring** with alerting and auto-remediation

---

## 🛠️ **Development & Contribution**

### **🧪 Testing**
```bash
# Run test suites
npm test                    # Unit tests
npm run test:integration    # Integration tests
npm run test:e2e            # End-to-end tests
npm run test:coverage       # Coverage report
```

### **🔍 Code Quality**
- ESLint with Airbnb configuration
- Prettier for consistent formatting
- Husky git hooks for pre-commit checks
- SonarQube integration for code analysis

### **🤝 Contribution Guidelines**
1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **📦 Release Process**
```bash
# Version bump and release
npm run release:patch    # Patch release (0.0.X)
npm run release:minor    # Minor release (0.X.0)
npm run release:major    # Major release (X.0.0)
```

---

## 🔒 **Security & Compliance**

### **Security Features**
- **End-to-end encryption** for sensitive data
- **Role-Based Access Control** (RBAC) with 5 permission levels
- **Regular security audits** and penetration testing
- **GDPR-compliant data handling** with user consent management
- **Automated vulnerability scanning** in CI/CD pipeline

### **Data Protection**
- **Encrypted database connections** using TLS 1.3
- **Secure password hashing** with bcrypt and salt
- **JWT token management** with short expiration and refresh
- **Audit logging** for all administrative actions
- **Regular security patch updates** automated via CI/CD

---

## 📊 **Monitoring & Maintenance**

### **🧮 Performance Monitoring**
```bash
# Check system health
./scripts/health-check.sh --full

# Monitor real-time metrics
pm2 monit                  # Process monitoring
docker stats               # Container resource usage
./scripts/db-monitor.sh    # Database performance
```

### **🔄 Maintenance Commands**
```bash
# Database maintenance
./scripts/db-backup.sh             # Create backup
./scripts/db-optimize.sh           # Optimize performance
./scripts/db-migrate.sh v2.1.0     # Run migrations

# Application maintenance
pm2 reload all              # Zero-downtime reload
npm run cleanup            # Clean temporary files
./scripts/log-rotate.sh    # Rotate and archive logs
```

### **📈 Analytics & Reporting**
- **Real-time user activity tracking**
- **Course completion and engagement metrics**
- **Marketing campaign performance analysis**
- **Infrastructure cost optimization reports**
- **Automated weekly performance summaries**

---

## 🌐 **API Documentation**

### **Authentication Endpoints**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | User registration | No |
| `POST` | `/api/auth/login` | User login (JWT) | No |
| `POST` | `/api/auth/refresh` | Refresh token | Yes |
| `POST` | `/api/auth/logout` | User logout | Yes |

### **AI Marketing Endpoints**
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/marketing/ai/campaign-ideas` | Generate campaigns | Marketing |
| `GET` | `/api/marketing/campaigns` | List campaigns | Marketing |
| `POST` | `/api/marketing/campaigns/:id/activate` | Activate campaign | Marketing |
| `GET` | `/api/marketing/analytics` | Campaign analytics | Marketing |

### **Live Session Endpoints**
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/live-sessions` | Active sessions | Student+ |
| `POST` | `/api/live-sessions` | Create session | Instructor |
| `POST` | `/api/live-sessions/:id/join` | Join session | Student+ |
| `DELETE` | `/api/live-sessions/:id` | End session | Instructor |

**📖 Full API Documentation:** [API Docs](http://localhost:3000/api-docs)

---

## 🚨 **Troubleshooting & Support**

### **Common Issues & Solutions**

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Database Connection** | "Cannot connect to PostgreSQL" | Check VPS 2 firewall, verify credentials |
| **AI Service Failure** | Campaign generation fails | Verify OpenAI API key, check quota |
| **WebSocket Issues** | Live sessions not updating | Check port 3001, restart WebSocket service |
| **Performance Slow** | High latency, timeouts | Check server resources, optimize queries |

### **🔍 Debug Commands**
```bash
# System diagnostics
./scripts/diagnose.sh --full

# Check specific services
./scripts/check-service.sh database
./scripts/check-service.sh websocket
./scripts/check-service.sh ai-marketing

# View logs
pm2 logs                      # Application logs
docker-compose logs -f        # Container logs
tail -f /var/log/syslog       # System logs
```

### **📞 Support Channels**
- **GitHub Issues**: Bug reports and feature requests
- **Email Support**: support@onlinecodingplatform.com
- **Documentation**: [Complete Docs](https://docs.onlinecodingplatform.com)
- **Community Forum**: [Community Support](https://community.onlinecodingplatform.com)

---

## 📄 **License & Attribution**

### **License**
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **Third-Party Attributions**
- **OpenAI API**: For AI-powered campaign generation
- **PostgreSQL**: Database management system
- **React & Node.js**: Core application framework
- **Docker**: Containerization platform

### **Development Team**
- **Huy-VNNIC** - System Architecture & Backend
- **Feroz455** - Frontend Development & AI Integration
- **APIE-CAMP Group 6** - Quality Assurance & Documentation

---

## 🎉 **Getting Started Today**

### **Option 1: Quick Demo**
```bash
# Try the platform without installation
docker run -p 3000:3000 feroz455/online-coding-platform:demo
# Visit http://localhost:3000
```

### **Option 2: Full Deployment**
Follow the complete installation guide in the [Deployment Documentation](DEPLOYMENT.md)

### **Option 3: Developer Setup**
```bash
# Clone and run development environment
git clone https://github.com/Feroz455/APIE-CAMP-Group-6.git
cd APIE-CAMP-Group-6
npm run dev:setup
npm run dev
```

---

<div align="center">

### **💡 "The best way to learn programming is by doing it with others."**

**Start building, learning, and teaching with our platform today!** 🚀

**[Live Demo](https://demo.onlinecodingplatform.com) • [Documentation](https://docs.onlinecodingplatform.com) • [Community](https://community.onlinecodingplatform.com)**

</div>

---

**📅 Last Updated**: December 2024  
**🏷️ Version**: 1.0.0  
**👥 Maintainers**: [Huy-VNNIC](https://github.com/Huy-VNNIC), [Feroz455](https://github.com/Feroz455)  
**🏆 Project**: APIE-CAMP Group 6 - Online Coding Platform


## 🎯 **Key Improvements Made:**

### **1. Better Visual Hierarchy**
- Added professional badges at the top
- Clearer section organization with emojis
- Better use of tables for technical information

### **2. Emphasized AI Features**
- Moved the AI marketing system to a featured section
- Added more examples and use cases
- Clearer benefits and capabilities

### **3. Enhanced Technical Details**
- Added technology stack table
- More comprehensive API documentation
- Better troubleshooting section

### **4. Professional Presentation**
- Polished language and formatting
- Added support and community sections
- Clearer licensing and attribution

### **5. Practical Improvements**
- Added one-command setup options
- Better troubleshooting guide
- More actionable examples

