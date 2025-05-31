const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

class ContainerService {
  constructor() {
    this.tempDir = path.join(__dirname, '../../temp');
    this.containerPrefix = 'mock_container_';
    this.defaultTimeout = 300; // 5 minutes in seconds
    
    // Khởi tạo thư mục temp
    this.initTempDir();
  }
  
  async initTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
      console.log('Temp directory initialized');
    } catch (error) {
      console.error('Error initializing temp directory:', error);
    }
  }
  
  async processCode(code, language = 'javascript') {
    try {
      console.log(`[ContainerService] Processing ${language} code`);
      
      // Tạo unique ID cho code này
      const codeId = uuidv4();
      
      // Đường dẫn lưu file code
      const filePath = await this.saveCodeToFile(code, codeId, language);
      console.log(`[ContainerService] Code saved to ${filePath}`);
      
      // Giả lập chạy container
      console.log(`[ContainerService] Mock: Running code from ${filePath} with language ${language}`);
      
      // Trả về thông tin giả lập
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + this.defaultTimeout);
      
      // Tạo mock output
      const mockOutput = await this.generateMockOutput(code, language, filePath);
      
      return {
        id: `${this.containerPrefix}${codeId}`,
        url: `http://localhost:3000/api/mock-output?id=${codeId}&language=${language}`,
        expiresAt,
        language,
        mockOutput
      };
    } catch (error) {
      console.error('[ContainerService] Error processing code:', error);
      throw error;
    }
  }
  
  async generateMockOutput(code, language, filePath) {
    let output = 'Code executed successfully!\n\n';
    
    try {
      switch (language.toLowerCase()) {
        case 'javascript':
          output += 'JavaScript Output:\n';
          if (code.includes('console.log')) {
            const matches = code.match(/console\.log\(['"](.*)['"]\)/g);
            if (matches) {
              output += matches
                .map(match => match.replace(/console\.log\(['"](.*)['"].*\)/, '$1'))
                .join('\n');
            } else {
              output += '// No console.log outputs detected';
            }
          } else {
            output += '// No console.log statements found.';
          }
          
          // Add module exports info if present
          if (code.includes('module.exports')) {
            output += '\n\nExported result:\n';
            output += '{\n  "message": "Hello, Coder!",\n  "timestamp": "' + new Date().toISOString() + '"\n}';
          }
          break;
        
        case 'python':
          output += 'Python Output:\n';
          if (code.includes('print')) {
            const matches = code.match(/print\(['"](.*)['"].*\)/g);
            if (matches) {
              output += matches
                .map(match => match.replace(/print\(['"](.*)['"].*\)/, '$1'))
                .join('\n');
            } else {
              output += '# No print outputs detected';
            }
          } else {
            output += '# No print statements found.';
          }
          break;
        
        case 'html':
          output += 'HTML Output: \n';
          output += '(HTML would be rendered in a browser frame)\n\n';
          output += 'HTML content has been saved and is available.';
          break;
        
        default:
          output += `${language.toUpperCase()} Output: Simulated output for ${language}`;
      }
      
      // Thêm thông tin file
      const stats = await fs.stat(filePath);
      output += `\n\n---\nFile info: ${path.basename(filePath)}, Size: ${stats.size} bytes`;
      
    } catch (error) {
      console.error('[ContainerService] Error generating mock output:', error);
      output += '\n\nError generating detailed output: ' + error.message;
    }
    
    return output;
  }
  
  async saveCodeToFile(code, codeId, language) {
    try {
      // Xác định extension file dựa vào ngôn ngữ
      const extension = this.getFileExtension(language);
      
      // Tạo tên file
      const fileName = `${codeId}${extension}`;
      const filePath = path.join(this.tempDir, fileName);
      
      // Lưu code vào file
      await fs.writeFile(filePath, code);
      
      return filePath;
    } catch (error) {
      console.error('[ContainerService] Error saving code to file:', error);
      throw error;
    }
  }
  
  getFileExtension(language) {
    switch (language.toLowerCase()) {
      case 'javascript':
        return '.js';
      case 'python':
        return '.py';
      case 'java':
        return '.java';
      case 'c':
        return '.c';
      case 'cpp':
        return '.cpp';
      case 'html':
        return '.html';
      default:
        return '.txt';
    }
  }
  
  async extendContainerTime(containerId) {
    try {
      // Giả lập extend thời gian
      console.log(`[ContainerService] Mock: Extending time for container ${containerId}`);
      
      // Cập nhật expiration time
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + this.defaultTimeout);
      
      return {
        id: containerId,
        expiresAt
      };
    } catch (error) {
      console.error('[ContainerService] Error extending container time:', error);
      throw error;
    }
  }
  
  async getRunningContainers() {
    // Giả lập danh sách containers
    return [`${this.containerPrefix}mock1`, `${this.containerPrefix}mock2`];
  }
  
  async cleanUpOldContainers() {
    console.log('[ContainerService] Mock: Cleaning up old containers');
    // Không làm gì trong môi trường giả lập
  }
}

module.exports = ContainerService;
