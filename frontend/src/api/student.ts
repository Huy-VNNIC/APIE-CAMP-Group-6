import axios from 'axios';

const API_URL = 'http://localhost:3005/api';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Thêm token vào header mỗi request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

const studentApi = {
  // Auth
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message || 'Network error' };
    }
  },
  
  // Dashboard - không còn dữ liệu mẫu
  getDashboard: async () => {
    try {
      const response = await apiClient.get('/student/dashboard');
      return response.data;
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
      throw error;
    }
  },
  
  // Các API khác...
};

export default studentApi;