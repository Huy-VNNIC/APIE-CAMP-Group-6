import React, { ReactNode } from 'react';
import useAuth from '../hooks/useAuth';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, currentDate } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600">Learning Platform</h1>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600 mr-4">Hello, {user?.name}</span>
              <button className="bg-primary-500 text-white px-3 py-1 rounded-md text-sm">Logout</button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):</span> {currentDate}
            </div>
            <div className="text-sm text-primary-600 font-medium mt-1 md:mt-0">
              <span>Current User's Login:</span> {user?.login || 'Huy-VNNIC'}
            </div>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;