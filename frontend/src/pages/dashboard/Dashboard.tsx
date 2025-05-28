import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import studentApi from '../../api/student';
import { DashboardResponse } from '../../types/student.types';
import DashboardLayout from '../../layouts/DashboardLayout';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const Dashboard: React.FC = () => {
  const { user, currentDate } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardResponse['data'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await studentApi.getDashboard();
        
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('An error occurred while loading your dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <DashboardLayout>
        <Alert type="error" message={error} />
      </DashboardLayout>
    );
  }
  
  if (!dashboardData) {
    return (
      <DashboardLayout>
        <Alert type="error" message="No dashboard data available" />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <div className="flex flex-col space-y-1 text-sm text-gray-600 mt-1">
              <p>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDate}</p>
              <p>Current User's Login: {user?.login || 'Huy-VNNIC'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold">Statistics</h2>
          <p className="mt-2">Progress: {dashboardData.dashboardData?.progress || 0}%</p>
          <p>Level: {dashboardData.dashboardData?.level || 1}</p>
          <p>Points: {dashboardData.dashboardData?.points || 0}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Enrolled Courses</h2>
          {dashboardData.enrolledCourses.map(course => (
            <div key={course.id} className="mb-4 pb-4 border-b">
              <h3 className="font-medium">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
              <p className="text-xs text-gray-500">Progress: {course.progress}%</p>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          {dashboardData.recentActivities.map(activity => (
            <div key={activity.id} className="mb-3 pb-3 border-b">
              <p className="text-sm">{activity.description}</p>
              <p className="text-xs text-gray-500">{activity.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;