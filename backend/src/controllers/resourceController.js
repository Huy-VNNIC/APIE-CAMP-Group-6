const ResourceModel = require('../models/resourceModel');
const { formatResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Get all learning resources
 */
const getAllResources = async (req, res) => {
  try {
    const { type } = req.query;
    
    const resources = await ResourceModel.getAll(type);
    
    return res.json(formatResponse(true, 'Resources retrieved successfully', resources));
  } catch (error) {
    logger.error('Error getting all resources:', error);
    return res.status(500).json(formatResponse(false, 'Failed to retrieve resources'));
  }
};

/**
 * Get resource by ID
 */
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const resource = await ResourceModel.getById(id);
    
    if (!resource) {
      return res.status(404).json(formatResponse(false, 'Resource not found'));
    }
    
    return res.json(formatResponse(true, 'Resource retrieved successfully', resource));
  } catch (error) {
    logger.error('Error getting resource by ID:', error);
    return res.status(500).json(formatResponse(false, 'Failed to retrieve resource'));
  }
};

/**
 * Search resources
 */
const searchResources = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json(formatResponse(false, 'Search keyword is required'));
    }
    
    const resources = await ResourceModel.search(keyword);
    
    return res.json(formatResponse(true, 'Search results', resources));
  } catch (error) {
    logger.error('Error searching resources:', error);
    return res.status(500).json(formatResponse(false, 'Search failed'));
  }
};

module.exports = {
  getAllResources,
  getResourceById,
  searchResources,
};