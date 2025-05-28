import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <aside className="w-64 bg-white shadow-sm dark:bg-gray-800 h-screen overflow-y-auto">
      <div className="px-4 py-5">
        <nav className="mt-5 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Dashboard
          </NavLink>
          
          <NavLink
            to="/learning/resources"
            className={({ isActive }) => `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Resources
          </NavLink>
          
          <NavLink
            to="/profile"
            className={({ isActive }) => `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Profile
          </NavLink>
          
          <NavLink
            to="/support/tickets"
            className={({ isActive }) => `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Support
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;