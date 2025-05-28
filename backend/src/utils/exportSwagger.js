/**
 * This script exports the Swagger documentation to a JSON file
 * Usage: node src/utils/exportSwagger.js
 */
const fs = require('fs');
const path = require('path');
const swaggerSpec = require('../config/swagger');

// Directory to save the file
const outputDir = path.join(__dirname, '../../docs');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// File path
const filePath = path.join(outputDir, 'swagger.json');

// Convert to JSON string with pretty formatting
const swaggerJson = JSON.stringify(swaggerSpec, null, 2);

// Write to file
fs.writeFileSync(filePath, swaggerJson);

console.log(`Swagger documentation exported to ${filePath}`);