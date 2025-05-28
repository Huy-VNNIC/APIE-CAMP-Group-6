// Middleware để kiểm tra role của user
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    
    // Kiểm tra nếu role của user nằm trong danh sách các roles được phép
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    next();
  };
};

module.exports = checkRole;