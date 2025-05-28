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

// Xử lý lỗi chung
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const studentApi = {
  // === AUTH API ===
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
  
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message || 'Network error' };
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/user');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  // === DASHBOARD & PROFILE API ===
  getDashboard: async () => {
    try {
      const response = await apiClient.get('/student/dashboard');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      const response = await apiClient.get('/student/profile');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  updateProfile: async (data: { name: string; email: string }) => {
    try {
      const response = await apiClient.put('/student/profile', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  updatePreferences: async (preferences: any) => {
    try {
      const response = await apiClient.put('/student/preferences', preferences);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  // === RESOURCES API ===
  getResources: async () => {
    try {
      const response = await apiClient.get('/student/resources');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  getResourceDetail: async (id: number) => {
    try {
      const response = await apiClient.get(`/student/resources/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  updateResourceProgress: async (resourceId: number, status: 'viewed' | 'in_progress' | 'completed') => {
    try {
      const response = await apiClient.post('/student/resources/progress', {
        resourceId,
        status
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  // === SUBMISSIONS API ===
  submitCode: async (resourceId: number, code: string, language: string = 'javascript') => {
    try {
      const response = await apiClient.post('/student/submissions', {
        resourceId,
        code,
        language
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  getSubmissionHistory: async (resourceId: number) => {
    try {
      const response = await apiClient.get(`/student/submissions/history/${resourceId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  getSubmissionDetail: async (id: number) => {
    try {
      const response = await apiClient.get(`/student/submissions/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  // === PROGRESS API ===
  getProgress: async () => {
    try {
      const response = await apiClient.get('/student/progress');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  getRecentActivities: async () => {
    try {
      const response = await apiClient.get('/student/activities');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  getCompletedResources: async () => {
    try {
      const response = await apiClient.get('/student/completed-resources');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
};

export default studentApi;