import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import studentApi from '../../api/student';
import { DashboardResponse } from '../../types/student.types';
// Thay đổi từ:
// import { DashboardLayout } from '../../layouts/DashboardLayout';
// Thành:
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import ProgressChart from '../../components/dashboard/ProgressChart';
import RecentResources from '../../components/dashboard/RecentResources';
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
      {/* Welcome Section */}
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
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Progress"
          value={`${dashboardData.dashboardData?.progress || 0}%`}
          icon="chart"
          trend={+5}
        />
        <StatCard
          title="Current Level"
          value={dashboardData.dashboardData?.level || 1}
          icon="level"
        />
        <StatCard
          title="Points"
          value={dashboardData.dashboardData?.points || 0}
          icon="points"
          trend={+120}
        />
        <StatCard
          title="Resources Completed"
          value={dashboardData.dashboardData?.completed_resources || 0}
          icon="book"
          trend={+2}
        />
      </div>
      
      {/* Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Learning Progress</h2>
            <ProgressChart 
              courses={dashboardData.enrolledCourses || []} 
            />
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Assignments</h2>
            <div>
              {dashboardData.upcomingAssignments && 
               dashboardData.upcomingAssignments.length > 0 ? (
                dashboardData.upcomingAssignments.map(assignment => (
                  <div key={assignment.id} className="mb-3 pb-3 border-b">
                    <h3 className="font-medium">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">Due: {assignment.due_date}</p>
                    <p className="text-xs text-gray-500">{assignment.course_title}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No upcoming assignments</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Resources & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentResources
            courses={dashboardData.enrolledCourses || []}
          />
        </div>
        
        <div>
          <ActivityFeed
            activities={dashboardData.recentActivities || []}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;