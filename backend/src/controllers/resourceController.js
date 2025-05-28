const resourceModel = require('../models/resourceModel');

const resourceController = {
  // Lấy tất cả resources
  async getAllResources(req, res) {
    try {
      const resources = await resourceModel.getAllResources();
      
      // Format dữ liệu trả về
      const formattedResources = resources.map(resource => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        language: resource.language,
        author: resource.created_by_name,
        created_at: resource.created_at
      }));
      
      res.json({
        success: true,
        data: formattedResources
      });
    } catch (err) {
      console.error('Get resources error:', err);
      res.status(500).json({
        success: false,
        msg: 'Server error'
      });
    }
  },
  
  // Lấy chi tiết một resource
  async getResourceById(req, res) {
    try {
      const resourceId = req.params.id;
      const resource = await resourceModel.getResourceById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          msg: 'Resource not found'
        });
      }
      
      res.json({
        success: true,
        data: {
          id: resource.id,
          title: resource.title,
          type: resource.type,
          language: resource.language,
          url: resource.url,
          author: resource.created_by_name,
          created_at: resource.created_at
        }
      });
    } catch (err) {
      console.error('Get resource error:', err);
      res.status(500).json({
        success: false,
        msg: 'Server error'
      });
    }
  },
  
  // Lấy resources theo loại
  async getResourcesByType(req, res) {
    try {
      const type = req.params.type;
      const resources = await resourceModel.getResourcesByType(type);
      
      res.json({
        success: true,
        data: resources
      });
    } catch (err) {
      console.error('Get resources by type error:', err);
      res.status(500).json({
        success: false,
        msg: 'Server error'
      });
    }
  }
};

module.exports = resourceController;