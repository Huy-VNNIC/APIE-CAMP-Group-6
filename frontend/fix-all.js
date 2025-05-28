/**
 * Đây là script đơn giản để kiểm tra và sửa tất cả các lỗi export/import phổ biến
 * trong một dự án React/TypeScript. Chạy với Node.js
 */

const fs = require('fs');
const path = require('path');

// Thư mục bắt đầu quét
const startDir = path.join(__dirname, 'src');

// Danh sách component muốn chuyển sang default export
const componentsToFix = [
  'DashboardLayout',
  'Sidebar',
  'Navbar',
  'Alert',
  'Loader',
  'StatCard',
  'ActivityFeed',
  'ProgressChart',
  'RecentResources',
  'SubmissionHistory',
  'VideoPlayer',
  'CodeEditor'
];

function findAndFixFiles(directory) {
  const items = fs.readdirSync(directory);

  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      findAndFixFiles(itemPath);
    } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
      fixFile(itemPath);
    }
  }
}

function fixFile(filePath) {
  console.log(`Checking ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Sửa named export thành default export
  const componentName = path.basename(filePath, path.extname(filePath));
  if (componentsToFix.includes(componentName)) {
    // Kiểm tra xem đã có default export chưa
    if (!content.includes(`export default ${componentName}`)) {
      // Kiểm tra xem có export const không
      if (content.includes(`export const ${componentName}`)) {
        content = content.replace(
          `export const ${componentName}`,
          `const ${componentName}`
        );
        content += `\n\nexport default ${componentName};`;
        modified = true;
        console.log(`  Fixed export for ${componentName}`);
      }
      // Nếu không có bất kỳ export nào, thêm default export
      else if (!content.includes('export default')) {
        content += `\n\nexport default ${componentName};`;
        modified = true;
        console.log(`  Added default export for ${componentName}`);
      }
    }
  }

  // 2. Sửa named import thành default import
  for (const component of componentsToFix) {
    const namedImportRegex = new RegExp(`import\\s*{\\s*${component}\\s*}\\s*from\\s*['"]([^'"]+)['"]`, 'g');
    if (namedImportRegex.test(content)) {
      content = content.replace(namedImportRegex, `import ${component} from '$1'`);
      modified = true;
      console.log(`  Fixed import of ${component} in ${filePath}`);
    }
  }

  // 3. Sửa imports từ api/student
  const apiImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/\.\.\/api\/student['"]/g;
  if (apiImportRegex.test(content)) {
    content = content.replace(apiImportRegex, `import studentApi from '../../api/student'`);
    modified = true;
    console.log(`  Fixed api import in ${filePath}`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Updated ${filePath}`);
  }
}

// Bắt đầu quét và sửa files
findAndFixFiles(startDir);
console.log('Done! All files have been checked and fixed.');