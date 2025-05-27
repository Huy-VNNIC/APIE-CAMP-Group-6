import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3005',  // Đã cập nhật sang cổng 3005
        changeOrigin: true,
        secure: false
      }
    }
  }
});