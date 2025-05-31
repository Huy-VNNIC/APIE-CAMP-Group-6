require('dotenv').config();
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function cleanupContainers() {
  console.log('Starting container cleanup...');
  
  try {
    // Lọc ra các container có tên bắt đầu bằng student_code_
    const { stdout: containerList } = await execAsync('docker ps -a --filter "name=student_code_" --format "{{.Names}}"');
    const containers = containerList.trim().split('\n').filter(Boolean);
    
    console.log(`Found ${containers.length} containers to clean up`);
    
    // Dừng và xóa từng container
    for (const container of containers) {
      console.log(`Cleaning up container: ${container}`);
      await execAsync(`docker stop ${container} || true`);
      await execAsync(`docker rm ${container} || true`);
    }
    
    // Xóa image không sử dụng
    console.log('Removing unused images...');
    await execAsync('docker image prune -f');
    
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupContainers();
