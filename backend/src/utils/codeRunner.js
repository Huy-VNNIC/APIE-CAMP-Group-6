const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const codeRunner = {
  // Chạy code và trả về kết quả
  async runCode(code, language = 'javascript') {
    try {
      let result;
      
      switch (language) {
        case 'javascript':
          result = await this.runJavaScript(code);
          break;
        case 'python':
          result = await this.runPython(code);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
      
      return result;
    } catch (err) {
      console.error('Run code error:', err);
      return {
        success: false,
        output: '',
        error: err.message
      };
    }
  },
  
  // Chạy JavaScript
  async runJavaScript(code) {
    const filename = `${uuidv4()}.js`;
    const filepath = path.join(__dirname, '../temp', filename);
    
    try {
      // Tạo thư mục temp nếu chưa có
      if (!fs.existsSync(path.join(__dirname, '../temp'))) {
        fs.mkdirSync(path.join(__dirname, '../temp'));
      }
      
      // Viết code vào file
      fs.writeFileSync(filepath, code);
      
      // Chạy code với timeout 5 giây
      const output = await this.executeCommand(`node ${filepath}`, 5000);
      
      return {
        success: true,
        output,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        output: '',
        error: err.message
      };
    } finally {
      // Xóa file tạm
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
  },
  
  // Chạy Python
  async runPython(code) {
    const filename = `${uuidv4()}.py`;
    const filepath = path.join(__dirname, '../temp', filename);
    
    try {
      // Tạo thư mục temp nếu chưa có
      if (!fs.existsSync(path.join(__dirname, '../temp'))) {
        fs.mkdirSync(path.join(__dirname, '../temp'));
      }
      
      // Viết code vào file
      fs.writeFileSync(filepath, code);
      
      // Chạy code với timeout 5 giây
      const output = await this.executeCommand(`python ${filepath}`, 5000);
      
      return {
        success: true,
        output,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        output: '',
        error: err.message
      };
    } finally {
      // Xóa file tạm
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
  },
  
  // Thực thi lệnh với timeout
  executeCommand(command, timeout) {
    return new Promise((resolve, reject) => {
      const process = exec(command, { timeout }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Execution error: ${stderr || error.message}`));
          return;
        }
        
        resolve(stdout);
      });
    });
  }
};

module.exports = codeRunner;