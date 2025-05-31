module.exports = (req, res, next) => {
  // Cho phép tất cả các origin
  res.header('Access-Control-Allow-Origin', '*');
  
  // Cho phép credentials
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Cho phép headers
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Cho phép methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Xử lý preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
};
