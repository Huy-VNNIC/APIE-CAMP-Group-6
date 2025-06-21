# Docker Setup for Marketing Role

This document explains how the Docker configuration has been updated to support the new Marketing role in the Online Coding Platform.

## Overview

The application is containerized using Docker and orchestrated with Docker Compose. The setup includes three main services:
- Frontend (React application)
- Backend (Node.js API)
- MongoDB (Database)

## Marketing Role Integration

The marketing role features have been fully integrated into the Docker setup with the following enhancements:

### Automated User Creation

- A marketing user is automatically created during container startup
- The startup script (`docker-entrypoint.sh`) creates both instructor and marketing users
- User credentials:
  - Username: `marketing`
  - Password: `marketing123`

### Running the Application

To start the application with Docker:

```bash
docker-compose up
```

This will:
1. Build and start all containers
2. Create the necessary database connections
3. Set up default users (including the marketing user)
4. Start both frontend and backend services

### Testing Marketing API

You can test the marketing API endpoints using the provided script:

```bash
# Make the script executable first
chmod +x test-marketing-api.sh

# Run the tests
./test-marketing-api.sh
```

### Environment Variables

No additional environment variables are needed for the marketing role beyond what's already defined in the docker-compose.yml file.

### Volumes and Persistence

All marketing data is stored in the MongoDB database, which uses a named volume (`mongodb_data`) for persistence.

## Troubleshooting

If the marketing user is not created automatically:
1. Check MongoDB connection in the backend logs
2. Manually run the script inside the container:
   ```
   docker-compose exec backend node scripts/create-marketing-user.js
   ```
