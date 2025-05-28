import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Tạo một axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để gắn token vào header
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
      return { success: false, message: error.message };
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
      return { success: false, message: error.message };
    }
  },
  
  // Dashboard
  getDashboard: async () => {
    try {
      const response = await apiClient.get('/student/dashboard');
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  
  // Learning Resources
  getLearningResources: async () => {
    try {
      const response = await apiClient.get('/resources');
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  
  getResourceDetail: async (resourceId: number) => {
    try {
      const response = await apiClient.get(`/resources/${resourceId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  
  // Code Submissions
  submitCode: async (resourceId: number, code: string) => {
    try {
      const response = await apiClient.post('/execution/run', {
        resourceId,
        code,
        language: 'javascript' // Default language
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  
  getSubmissionHistory: async (resourceId: number) => {
    try {
      const response = await apiClient.get(`/execution/history/${resourceId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  
  // Support Tickets
  getTickets: async () => {
    try {
      const response = await apiClient.get('/tickets');
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  
  getTicketDetail: async (ticketId: number) => {
    try {
      const response = await apiClient.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  
  createTicket: async (ticketData: { subject: string; message: string; category: string }) => {
    try {
      const response = await apiClient.post('/tickets', ticketData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  
  addTicketResponse: async (ticketId: number, message: string) => {
    try {
      const response = await apiClient.post(`/tickets/${ticketId}/responses`, { message });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  
  // Profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/student/profile');
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  
  updateProfile: async (profileData: any) => {
    try {
      const response = await apiClient.put('/student/profile', profileData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  
  updatePreferences: async (preferencesData: any) => {
    try {
      const response = await apiClient.put('/student/preferences', preferencesData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
};

export default studentApi;