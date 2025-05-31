const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execAsync = util.promisify(exec);

class ContainerService {
  constructor() {
    this.baseDir = process.env.CODE_FILES_DIR || '/tmp/code-execution';
    this.containerPrefix = 'student_code_';
    this.containerPort = 8080;
    this.hostBasePort = 10000;
    this.maxContainerLifetime = 3600000; // 1 hour
    this.activeContainers = new Map();

    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }

    setInterval(() => this.cleanupContainers(), 300000); // every 5 minutes
  }

  async createWorkspace(code, language) {
    const id = uuidv4();
    const workDir = path.join(this.baseDir, id);

    fs.mkdirSync(workDir, { recursive: true });

    const fileExtension = this.getFileExtension(language);
    const fileName = `main${fileExtension}`;

    fs.writeFileSync(path.join(workDir, fileName), code);

    const dockerfile = this.generateDockerfile(language, fileName);
    fs.writeFileSync(path.join(workDir, 'Dockerfile'), dockerfile);

    return { id, workDir, fileName };
  }

  getFileExtension(language) {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return '.js';
      case 'html':
        return '.html';
      case 'python':
      case 'py':
        return '.py';
      case 'java':
        return '.java';
      case 'c':
        return '.c';
      case 'cpp':
      case 'c++':
        return '.cpp';
      case 'go':
        return '.go';
      case 'php':
        return '.php';
      case 'ruby':
      case 'rb':
        return '.rb';
      default:
        return '.txt';
    }
  }

  generateDockerfile(language, fileName) {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return `FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm init -y && npm install express
RUN echo 'const express = require("express");\\n\
const app = express();\\n\
const port = process.env.PORT || ${this.containerPort};\\n\
app.use(express.static("."));\\n\
const mainCode = require("./${fileName}");\\n\
if (typeof mainCode === "function") {\\n\
  app.get("/api", (req, res) => res.json(mainCode(req.query)));\\n\
}\\n\
app.listen(port, () => console.log("Server running on port " + port));' > server.js
CMD ["node", "server.js"]`;

      case 'html':
        return `FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE ${this.containerPort}
CMD ["nginx", "-g", "daemon off;"]`;

      case 'python':
      case 'py':
        return `FROM python:3.9-slim
WORKDIR /app
COPY . .
RUN pip install flask gunicorn
RUN echo 'from flask import Flask, request, jsonify, send_from_directory\\n\
import importlib.util\\n\
import os\\n\
import sys\\n\
\\n\
app = Flask(__name__, static_url_path="")\\n\
\\n\
spec = importlib.util.spec_from_file_location("student_module", "${fileName}")\\n\
student_module = importlib.util.module_from_spec(spec)\\n\
spec.loader.exec_module(student_module)\\n\
\\n\
@app.route("/")\\n\
def index():\\n\
    return send_from_directory(".", "index.html") if os.path.exists("index.html") else "Python App Running"\\n\
\\n\
@app.route("/api")\\n\
def api():\\n\
    if hasattr(student_module, "main"):\\n\
        result = student_module.main()\\n\
        return jsonify(result)\\n\
    return "No main function found"\\n\
\\n\
if __name__ == "__main__":\\n\
    app.run(host="0.0.0.0", port=${this.containerPort})' > server.py
CMD ["python", "server.py"]`;

      case 'php':
        return `FROM php:7.4-apache
COPY . /var/www/html/
EXPOSE ${this.containerPort}
CMD ["apache2-foreground"]`;

      default:
        return `FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE ${this.containerPort}
CMD ["nginx", "-g", "daemon off;"]`;
    }
  }

  async buildAndRunContainer(workspaceInfo) {
    const { id, workDir } = workspaceInfo;
    const containerName = `${this.containerPrefix}${id}`;
    const hostPort = this.findAvailablePort();

    try {
      console.log(`Building container for ${id}...`);
     await execAsync(`cd ${workDir} && sudo docker build -t ${containerName} .`);

      console.log(`Starting container ${containerName} on port ${hostPort}...`);
      await execAsync(`sudo docker run -d --name ${containerName} -p ${hostPort}:${this.containerPort} ${containerName}`);

      const containerInfo = {
        id,
        containerName,
        workDir,
        hostPort,
        url: `http://localhost:${hostPort}`,
        createdAt: Date.now(),
        expiresAt: Date.now() + this.maxContainerLifetime
      };

      this.activeContainers.set(id, containerInfo);
      console.log(`Container ${containerName} started successfully.`);

      return containerInfo;
    } catch (error) {
      console.error('Error building/running container:', error);
      await this.cleanupWorkspace(id, workDir);
      throw new Error(`Failed to build/run container: ${error.message}`);
    }
  }

  findAvailablePort() {
    const usedPorts = Array.from(this.activeContainers.values()).map(info => info.hostPort);
    let port = this.hostBasePort;
    while (usedPorts.includes(port)) {
      port++;
    }
    return port;
  }

  async cleanupContainer(id) {
    const containerInfo = this.activeContainers.get(id);
    if (!containerInfo) return false;

    try {
      await execAsync(`sudo docker stop ${containerInfo.containerName} || true`);
      await execAsync(`sudo docker rm ${containerInfo.containerName} || true`);
      await execAsync(`sudo docker rmi ${containerInfo.containerName} || true`);

      await this.cleanupWorkspace(id, containerInfo.workDir);
      this.activeContainers.delete(id);

      console.log(`Container ${containerInfo.containerName} cleaned up successfully.`);
      return true;
    } catch (error) {
      console.error(`Error cleaning up container ${id}:`, error);
      return false;
    }
  }

  async cleanupWorkspace(id, workDir) {
    try {
      if (fs.existsSync(workDir)) {
        fs.rmSync(workDir, { recursive: true, force: true });
      }
    } catch (error) {
      console.error(`Error cleaning up workspace for ${id}:`, error);
    }
  }

  async cleanupContainers() {
    console.log('Running scheduled container cleanup...');
    const now = Date.now();

    for (const [id, info] of this.activeContainers.entries()) {
      if (info.expiresAt < now) {
        console.log(`Container ${info.containerName} expired, cleaning up...`);
        await this.cleanupContainer(id);
      }
    }
  }

  getContainerInfo(id) {
    return this.activeContainers.get(id);
  }

  extendContainerLifetime(id, additionalTime = this.maxContainerLifetime) {
    const containerInfo = this.activeContainers.get(id);
    if (containerInfo) {
      containerInfo.expiresAt = Date.now() + additionalTime;
      this.activeContainers.set(id, containerInfo);
      return containerInfo;
    }
    return null;
  }

  async processCode(code, language) {
    const workspace = await this.createWorkspace(code, language);
    const containerInfo = await this.buildAndRunContainer(workspace);
    return containerInfo;
  }
}

module.exports = new ContainerService();
