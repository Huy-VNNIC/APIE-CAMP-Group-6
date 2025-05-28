import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Tải biến môi trường dựa vào mode (development, production)
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    server: {
      port: 3001,
      hmr: true,
    },
    optimizeDeps: {
      force: true,
      include: ['react', 'react-dom', 'react-router-dom']
    },
    build: {
      sourcemap: true
    },
    define: {
      // Biến môi trường
      'process.env': env,
      // Hoặc định nghĩa trực tiếp process
      process: {
        env: env
      }
    }
  };
});