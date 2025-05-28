import { useState, useEffect } from 'react';
import { User } from '../types/student.types';
import { formatDateUTC } from '../utils/formatters';

const useAuth = () => {
  const [user, setUser] = useState<User | null>({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    login: 'Huy-VNNIC'
  });
  
  const [currentDate, setCurrentDate] = useState<string>(formatDateUTC(new Date()));
  
  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(formatDateUTC(new Date()));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const logout = () => {
    setUser(null);
  };
  
  return {
    user,
    currentDate,
    logout,
    isAuthenticated: !!user
  };
};

export default useAuth;