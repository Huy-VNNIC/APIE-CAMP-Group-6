import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Cập nhật import

const Navbar: React.FC = () => {
  const { user, logout, currentDate } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-blue-600 font-bold text-xl">
                CodeLearn
              </Link>
            </div>
            {/* ... phần còn lại giữ nguyên ... */}
          </div>
          <div className="flex items-center">
            {/* Hiển thị thời gian UTC và Login theo yêu cầu */}
            <div className="hidden md:flex mr-4 items-center">
              <span className="text-sm text-gray-600 mr-4">
                Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDate}
              </span>
              <span className="text-sm font-medium text-blue-600">
                Current User's Login: {user?.login || 'Huy-VNNIC'}
              </span>
            </div>
            
            {/* User Dropdown */}
            <div className="relative ml-3">
              {/* ... phần còn lại giữ nguyên ... */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile display of current date and login */}
      <div className="sm:hidden border-t border-gray-200 bg-gray-50 px-4 py-2">
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-gray-500">
            Current Date and Time (UTC): {currentDate}
          </span>
          <span className="text-xs font-medium text-blue-600">
            Current User's Login: {user?.login || 'Huy-VNNIC'}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;