import axiosInstance from './axiosConfig';
import { LoginRequest, RegisterRequest, User } from '../types/auth.types';

const authApi = {
  login: async (credentials: LoginRequest) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: RegisterRequest) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
  
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  changePassword: async (data: { currentPassword: string, newPassword: string }) => {
    const response = await axiosInstance.post('/auth/change-password', data);
    return response.data;
  }
};

export default authApi;