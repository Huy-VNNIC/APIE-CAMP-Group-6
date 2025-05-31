const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const execPromise = util.promisify(exec);

class ContainerService {
  constructor() {
    this.tempDir = path.join(__dirname, '../../temp');
    this.containerPrefix = 'student_code_';
    this.defaultTimeout = 300; // 5 minutes in seconds
    
    // Tạo thư mục temp nếu chưa tồn tại
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
      // Tạo unique ID cho code này
      const codeId = uuidv4();
      
      // Đường dẫn lưu file code
      const filePath = await this.saveCodeToFile(code, codeId, language);
      
      // Tạo và chạy container
      const containerInfo = await this.runContainer(filePath, codeId, language);
      
      return containerInfo;
    } catch (error) {
      console.error('Error processing code:', error);
      throw error;
    }
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
      console.error('Error saving code to file:', error);
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
  
  async runContainer(filePath, codeId, language) {
    try {
      // Tạo container name
      const containerName = `${this.containerPrefix}${codeId}`;
      
      // Lấy tuyệt đối path từ filePath
      const absoluteFilePath = path.resolve(filePath);
      const fileName = path.basename(filePath);
      
      // Tạo lệnh docker tương ứng với ngôn ngữ
      const dockerCommand = this.getDockerCommand(containerName, absoluteFilePath, fileName, language);
      
      // Thực thi lệnh docker
      console.log(`Running command: ${dockerCommand}`);
      await execPromise(dockerCommand);
      
      // Lấy port mapping từ container
      const { stdout: portOutput } = await execPromise(`docker port ${containerName}`);
      const port = this.extractPort(portOutput);
      
      // Lấy IP của host
      const host = 'localhost';
      
      // Tạo URL để truy cập container
      const url = `http://${host}:${port}`;
      
      // Thiết lập expiration time
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + this.defaultTimeout);
      
      return {
        id: containerName,
        url,
        expiresAt,
        language
      };
    } catch (error) {
      console.error('Error running container:', error);
      throw error;
    }
  }
  
  getDockerCommand(containerName, filePath, fileName, language) {
    // Thư mục trong container để mount file code
    const containerDir = '/app';
    
    switch (language.toLowerCase()) {
      case 'javascript':
        return `docker run -d --name ${containerName} -v "${filePath}:${containerDir}/${fileName}" -p 0:3000 node:14-alpine sh -c "cd ${containerDir} && npm init -y && npm install express && node -e 'const express = require(\\"express\\"); const app = express(); app.get(\\"/\\", (req, res) => { try { const result = require(\\"${containerDir}/${fileName}\\"); res.json({ result: result() }); } catch (error) { res.status(500).json({ error: error.message }); } }); app.listen(3000);'"`;
      
      case 'python':
        return `docker run -d --name ${containerName} -v "${filePath}:${containerDir}/${fileName}" -p 0:5000 python:3.9-alpine sh -c "cd ${containerDir} && pip install flask && FLASK_APP=${fileName} flask run --host=0.0.0.0 --port=5000"`;
      
      case 'html':
        return `docker run -d --name ${containerName} -v "${filePath}:${containerDir}/${fileName}" -p 0:80 nginx:alpine sh -c "cp ${containerDir}/${fileName} /usr/share/nginx/html/index.html && nginx -g 'daemon off;'"`;
      
      default:
        // Fallback cho ngôn ngữ chưa được hỗ trợ
        return `docker run -d --name ${containerName} -v "${filePath}:${containerDir}/${fileName}" -p 0:8080 alpine:latest sh -c "cd ${containerDir} && cat ${fileName} > /dev/stdout && echo 'File content displayed' > /tmp/result.txt && while true; do sleep 1000; done"`;
    }
  }
  
  extractPort(portOutput) {
    // Ví dụ: "80/tcp -> 0.0.0.0:32773" -> Lấy 32773
    const match = portOutput.match(/:(\d+)/);
    return match ? match[1] : null;
  }
  
  async extendContainerTime(containerId) {
    try {
      // Kiểm tra container có tồn tại không
      const { stdout } = await execPromise(`docker ps -a --filter "name=${containerId}" --format "{{.Names}}"`);
      
      if (!stdout.includes(containerId)) {
        throw new Error('Container không tồn tại');
      }
      
      // Cập nhật expiration time
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + this.defaultTimeout);
      
      return {
        id: containerId,
        expiresAt
      };
    } catch (error) {
      console.error('Error extending container time:', error);
      throw error;
    }
  }
  
  async getRunningContainers() {
    try {
      const { stdout } = await execPromise(`docker ps --filter "name=${this.containerPrefix}" --format "{{.Names}}"`);
      const containers = stdout.split('\n').filter(Boolean);
      return containers;
    } catch (error) {
      console.error('Error getting running containers:', error);
      return [];
    }
  }
  
  async cleanUpOldContainers() {
    try {
      const containers = await this.getRunningContainers();
      
      for (const container of containers) {
        // Lấy thông tin về thời gian container đã chạy
        const { stdout } = await execPromise(`docker ps --filter "name=${container}" --format "{{.RunningFor}}"`);
        
        // Kiểm tra nếu container đã chạy quá 5 phút
        if (stdout.includes('minute') && parseInt(stdout) > 5) {
          console.log(`Stopping old container: ${container}`);
          await execPromise(`docker stop ${container} && docker rm ${container}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up containers:', error);
    }
  }
}

module.exports = ContainerService;
