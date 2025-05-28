const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Coding Platform API',
      version: '1.0.0',
      description: 'API documentation for Online Coding Platform',
      contact: {
        name: 'Huy-VNNIC',
        email: 'huy@example.com'
      }
    },
    servers: [
      {
        url: '/',
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.js'] // Path to the API routes files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;