exports.isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. Student role required',
    timestamp: new Date().toISOString()
  });
};

exports.isInstructor = (req, res, next) => {
  if (req.user && req.user.role === 'instructor') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. Instructor role required',
    timestamp: new Date().toISOString()
  });
};

exports.isSupport = (req, res, next) => {
  if (req.user && req.user.role === 'support') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. Support role required',
    timestamp: new Date().toISOString()
  });
};

exports.isMarketing = (req, res, next) => {
  if (req.user && (req.user.role === 'marketing' || req.user.role === 'admin')) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. Marketing role required',
    timestamp: new Date().toISOString()
  });
};

exports.isDeveloper = (req, res, next) => {
  if (req.user && req.user.role === 'developer') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. Developer role required',
    timestamp: new Date().toISOString()
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admin role required',
    timestamp: new Date().toISOString()
  });
};

exports.isAnyOf = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: `Access denied. One of [${roles.join(', ')}] roles required`,
      timestamp: new Date().toISOString()
    });
  };
};