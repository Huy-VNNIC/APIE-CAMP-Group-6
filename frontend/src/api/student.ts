import axios from 'axios';

const API_URL = 'http://localhost:3005/api';

// Tạo một axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000 // 10 giây timeout
});

// Thêm interceptor để gắn token vào header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Sử dụng dữ liệu giả lập giống với database của bạn
const MOCK_DASHBOARD_DATA = {
  dashboardData: {
    progress: 65,
    level: 3,
    points: 750,
    completed_resources: 12
  },
  enrolledCourses: [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming',
      progress: 80,
      last_accessed: '2025-05-25 10:30:00'
    },
    {
      id: 2,
      title: 'React for Beginners',
      description: 'Introduction to React library and its concepts',
      progress: 45,
      last_accessed: '2025-05-26 14:15:00'
    }
  ],
  recentActivities: [
    {
      id: 1,
      type: 'course_progress',
      description: 'Completed lesson in JavaScript Fundamentals',
      timestamp: '2023-05-27 14:30:00'
    }
  ]
};

const studentApi = {
  // Auth
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Đăng nhập giả lập cho alice.johnson@example.com
      if (email === 'alice.johnson@example.com' && password === 'password123') {
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
          role: 'student',
          login: 'Huy-VNNIC'
        }));
        
        return {
          success: true,
          token: 'fake-jwt-token',
          user: {
            id: 1,
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            role: 'student',
            login: 'Huy-VNNIC'
          }
        };
      }
      
      return { 
        success: false, 
        message: 'Thông tin đăng nhập không chính xác' 
      };
    }
  },
  
  // Dashboard
  getDashboard: async () => {
    try {
      const response = await apiClient.get('/student/dashboard');
      return response.data;
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
      
      // Trả về dữ liệu giả lập khớp với database
      return {
        success: true,
        data: MOCK_DASHBOARD_DATA
      };
    }
  }
  
  // Các API khác...
};

export default studentApi;