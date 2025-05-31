const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// API để xem output của code đã lưu
router.get('/mock-output', async (req, res) => {
  try {
    console.log("[MockOutput] Request received:", req.query);
    const { id, language } = req.query;
    
    if (!id) {
      return res.status(400).send('Missing ID parameter');
    }
    
    // Xác định extension file dựa vào ngôn ngữ
    const extension = getFileExtension(language || 'javascript');
    
    // Tạo tên file
    const fileName = `${id}${extension}`;
    const filePath = path.join(__dirname, '../../temp', fileName);
    
    console.log(`[MockOutput] Attempting to read file: ${filePath}`);
    
    // Đọc nội dung file
    let fileContent;
    try {
      fileContent = await fs.readFile(filePath, 'utf8');
    } catch (error) {
      console.error('[MockOutput] File read error:', error);
      return res.status(404).send('File not found or could not be read. Please try running your code again.');
    }
    
    // Nếu là HTML, trả về HTML
    if (language === 'html') {
      res.header('Content-Type', 'text/html');
      return res.send(fileContent);
    }
    
    // Tạo HTML response
    const html = generateResultHtml(fileContent, language, id);
    
    res.send(html);
  } catch (error) {
    console.error('[MockOutput] Error serving output:', error);
    res.status(500).send(`
      <html>
        <body>
          <h1>Error</h1>
          <p>Could not display code output: ${error.message}</p>
          <p>Please try running your code again.</p>
        </body>
      </html>
    `);
  }
});

// Hàm để xác định extension file
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

// Hàm escapeHtml để tránh XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Hàm tạo output giả lập
function generateMockOutput(code, language) {
  let output = 'Code executed successfully!\n\n';
  
  switch (language.toLowerCase()) {
    case 'javascript':
      output += 'JavaScript Output:\n';
      if (code.includes('console.log')) {
        const matches = code.match(/console\.log\(['"`](.*?)['"`]\)/g);
        if (matches) {
          output += matches
            .map(match => match.replace(/console\.log\(['"`](.*?)['"`].*?\)/, '$1'))
            .join('\n');
        } else {
          output += '// No visible console output';
        }
      } else {
        output += '// No console.log statements found';
      }
      
      // Add module exports result
      if (code.includes('module.exports')) {
        output += '\n\nExported Result:\n';
        output += '{\n  "message": "Hello, Coder!",\n  "timestamp": "' + new Date().toISOString() + '"\n}';
      }
      break;
    
    case 'python':
      output += 'Python Output:\n';
      if (code.includes('print')) {
        const matches = code.match(/print\(['"`](.*?)['"`].*?\)/g);
        if (matches) {
          output += matches
            .map(match => match.replace(/print\(['"`](.*?)['"`].*?\)/, '$1'))
            .join('\n');
        } else {
          output += '# No visible print output';
        }
      } else {
        output += '# No print statements found';
      }
      break;
    
    case 'html':
      output += 'HTML renders in the browser';
      break;
    
    default:
      output += `${language.toUpperCase()} Output: Simulated output for ${language}`;
  }
  
  return output;
}

// Hàm tạo HTML kết quả
function generateResultHtml(fileContent, language, id) {
  const languageDisplay = language.charAt(0).toUpperCase() + language.slice(1);
  const output = generateMockOutput(fileContent, language);
  
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
