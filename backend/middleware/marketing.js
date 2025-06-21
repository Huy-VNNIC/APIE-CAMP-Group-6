const marketingAuth = (req, res, next) => {
  // Check if user exists and has the marketing role
  if (!req.user || req.user.role !== 'marketing') {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied. Marketing role required.' 
    });
  }
  
  next();
};

module.exports = marketingAuth;
