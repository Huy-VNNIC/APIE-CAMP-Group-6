import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cấu hình axios
  useEffect(() => {
    // Đặt token cho tất cả các request
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }

    // Xử lý khi token hết hạn
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
  }, [token]);

  // Kiểm tra token hiện tại
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("Verifying stored token:", token);

        // Kiểm tra token
        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && response.data.success) {
          console.log("Token valid, user data:", response.data.user);
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          console.log("Invalid response format:", response.data);
          logout();
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
