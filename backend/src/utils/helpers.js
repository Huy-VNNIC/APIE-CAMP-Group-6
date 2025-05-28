const crypto = require('crypto');

/**
 * Generate a random token
 * @param {number} length - Length of the token
 * @returns {string} - Random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Format response object
 * @param {boolean} success - Response status
 * @param {string} message - Response message
 * @param {*} data - Response data
 * @returns {Object} - Formatted response
 */
const formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Handle API errors
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Error response
 */
const handleError = (error, req, res) => {
  console.error(`Error in ${req.method} ${req.originalUrl}:`, error);
  return res.status(500).json(formatResponse(false, 'Internal server error'));
};

module.exports = {
  generateToken,
  formatResponse,
  handleError,
};