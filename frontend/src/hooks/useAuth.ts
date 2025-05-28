import { useState, useEffect } from 'react';
import { User } from '../types/student.types';
import axios from 'axios';

const API_URL = 'http://localhost:3005/api';

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>(formatDateUTC(new Date()));
  
  useEffect(() => {
    // Cập nhật thời gian UTC mỗi giây
    const timer = setInterval(() => {
      setCurrentDate(formatDateUTC(new Date()));
    }, 1000);
    
    // Kiểm tra xác thực khi component mount
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`${API_URL}/auth/user`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          login: response.data.login || 'Huy-VNNIC'
        });
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth error:', err);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    return () => clearInterval(timer);
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        
        setUser({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          login: response.data.user.login || 'Huy-VNNIC'
        });
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại' 
      };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return {
    user,
    loading,
    isAuthenticated,
    currentDate,
    login,
    logout
  };
};

// Hàm helper format thời gian UTC
function formatDateUTC(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export { useAuth };
export default useAuth;