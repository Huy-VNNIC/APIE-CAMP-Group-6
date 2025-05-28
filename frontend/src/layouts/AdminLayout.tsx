import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Book,
  FileText,
  Award,
  HelpCircle,
  Settings,
  BarChart2,
  LogOut
} from 'react-feather';
import useAuth from '../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin/dashboard', icon: <Home size={20} />, label: 'Tổng quan' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Quản lý người dùng' },
    { path: '/admin/resources', icon: <Book size={20} />, label: 'Tài liệu học tập' },
    { path: '/admin/reports', icon: <FileText size={20} />, label: 'Báo cáo' },
    { path: '/admin/certificates', icon: <Award size={20} />, label: 'Chứng chỉ' },
    { path: '/admin/support', icon: <HelpCircle size={20} />, label: 'Hỗ trợ' },
    { path: '/admin/statistics', icon: <BarChart2 size={20} />, label: 'Thống kê' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Cài đặt' },
  ];
  
  return (
    <div className="admin-layout">
      {/* Sidebar cho màn hình nhỏ */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>
      
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        
        <div className="sidebar-user">
          <div className="avatar">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.name || 'Admin'}</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
        
        <nav className="sidebar-navigation">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-button" onClick={logout}>
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>{menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}</h1>
          <div className="admin-actions">
            {/* Thêm các nút action nếu cần */}
          </div>
        </header>
        
        <div className="admin-content">
          {children}
        </div>
        
        <footer className="admin-footer">
          <p>&copy; {new Date().getFullYear()} Learning Platform Admin. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;