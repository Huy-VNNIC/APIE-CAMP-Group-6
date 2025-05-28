// Đảm bảo thư mục utils tồn tại
const fs = require('fs');
const path = require('path');

const utilsDir = path.join(__dirname);
if (!fs.existsSync(utilsDir)) {
  fs.mkdirSync(utilsDir, { recursive: true });
}

// Tạo logger đơn giản
const logger = {
  info: (message) => {
    console.log(`[INFO] ${message}`);
  },
  warn: (message) => {
    console.warn(`[WARN] ${message}`);
  },
  error: (message) => {
    console.error(`[ERROR] ${message}`);
  },
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`);
    }
  }
};

module.exports = logger;