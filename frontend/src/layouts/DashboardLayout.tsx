import React, { ReactNode } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import useAuth from '../hooks/useAuth';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, currentDate } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Info Bar with UTC Time and Login */}
            <div className="mb-4 p-3 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):</span> {currentDate}
                </div>
                <div className="text-sm text-primary-600 font-medium dark:text-primary-400 mt-1 md:mt-0">
                  <span>Current User's Login:</span> {user?.login || 'Huy-VNNIC'}
                </div>
              </div>
            </div>
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;