const express = require('express');
const router = express.Router();
const ContainerService = require('../services/containerService');
const fs = require('fs').promises;
const path = require('path');

const containerService = new ContainerService();

// Bỏ yêu cầu xác thực để ai cũng có thể test
router.post('/run-code', async (req, res) => {
  try {
    console.log("[TestRoutes] Request received to run code, language:", req.body.language);
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu code'
      });
    }
    
    // Trích xuất một phần code để log (tránh log quá nhiều)
    const codePreview = code.length > 100 ? code.substring(0, 100) + '...' : code;
    console.log(`[TestRoutes] Processing ${language} code: ${codePreview}`);
    
    const result = await containerService.processCode(code, language || 'javascript');
    
    res.json({
      success: true,
      message: 'Code đã được chạy thành công',
      containerInfo: result
    });
  } catch (error) {
    console.error('[TestRoutes] Error running code:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi chạy code: ' + (error.message || 'Lỗi không xác định'),
      error: error.message
    });
  }
});

// API để xem kết quả code
router.get('/mock-output', async (req, res) => {
  try {
    const { id, language } = req.query;
    
    if (!id) {
      return res.status(400).send('Missing ID parameter');
    }
    
    // Xác định extension file dựa vào ngôn ngữ
    const extension = getFileExtension(language || 'javascript');
    
    // Tạo tên file
    const fileName = `${id}${extension}`;
    const filePath = path.join(__dirname, '../../temp', fileName);
    
    // Đọc nội dung file
    let fileContent;
    try {
      fileContent = await fs.readFile(filePath, 'utf8');
    } catch (error) {
      console.error('[TestRoutes] Error reading file:', error);
      return res.status(404).send('File not found or could not be read');
    }
    
    // Tạo HTML response
    const html = generateResultHtml(fileContent, language || 'javascript', id);
    
    res.send(html);
  } catch (error) {
    console.error('[TestRoutes] Error serving mock output:', error);
    res.status(500).send('Error serving mock output: ' + error.message);
  }
});

// API để extend thời gian container
router.post('/extend-container/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    
    console.log(`[TestRoutes] Extending container time for ${containerId}`);
    const result = await containerService.extendContainerTime(containerId);
    
    res.json({
      success: true,
      message: 'Container time extended successfully',
      container: result
    });
  } catch (error) {
    console.error('[TestRoutes] Error extending container time:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi extend container: ' + error.message,
      error: error.message
    });
  }
});

function getFileExtension(language) {
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

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateMockOutput(code, language) {
  let output = 'Code executed successfully!\n\n';
  
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
          output += '// No visible output';
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
          output += '# No visible output';
        }
      } else {
        output += '# No print statements found.';
      }
      break;
    
    case 'html':
      if (code.includes('<html>')) {
        output += 'HTML has been rendered successfully.';
      } else {
        output += 'HTML has been rendered with default structure.';
      }
      break;
    
    default:
      output += `${language.toUpperCase()} Output: Simulated output for ${language}`;
  }
  
  return output;
}

function generateResultHtml(fileContent, language, id) {
  // Generate HTML to display the result
  const languageDisplay = language.charAt(0).toUpperCase() + language.slice(1);
  const output = generateMockOutput(fileContent, language);
  
  if (language === 'html') {
    // For HTML, actually render the HTML content
    return fileContent;
  }
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${languageDisplay} Code Result</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        line-height: 1.6;
      }
      .container {
        max-width: 900px;
        margin: 0 auto;
      }
      .header {
        margin-bottom: 20px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }
      pre {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 4px;
        overflow-x: auto;
        font-family: 'Courier New', Courier, monospace;
      }
      .code {
        margin-bottom: 20px;
      }
      .output {
        background-color: #f0f8ff;
        border-left: 5px solid #2196f3;
      }
      .timestamp {
        color: #666;
        font-size: 0.8em;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${languageDisplay} Code Execution Result</h1>
        <p>Code ID: ${id}</p>
      </div>
      
      <h2>Source Code:</h2>
      <pre class="code">${escapeHtml(fileContent)}</pre>
      
      <h2>Output:</h2>
      <pre class="output">${escapeHtml(output)}</pre>
      
      <p class="timestamp">Executed at: ${new Date().toLocaleString()}</p>
    </div>
  </body>
  </html>
  `;
}

module.exports = router;
