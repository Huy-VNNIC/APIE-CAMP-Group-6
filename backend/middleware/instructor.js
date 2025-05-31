module.exports = function(req, res, next) {
  // Make sure user is authenticated first
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  // Check user role
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Instructor role required.' });
  }
  
  next();
};
