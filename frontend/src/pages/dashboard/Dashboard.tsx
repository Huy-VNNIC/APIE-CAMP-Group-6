import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import studentApi from '../../api/student';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import ProgressChart from '../../components/dashboard/ProgressChart';
import EnrolledCoursesList from '../../components/dashboard/EnrolledCoursesList';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const Dashboard: React.FC = () => {
  const { user, currentDate } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
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
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </DashboardLayout>
    );
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
  
  const { dashboardData: stats, enrolledCourses, recentActivities, upcomingAssignments } = dashboardData;
  
  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <div className="text-sm text-gray-600 mt-1 dark:text-gray-400">
              <p>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDate}</p>
              <p>Current User's Login: {user?.login || 'Huy-VNNIC'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Overall Progress"
          value={`${stats?.progress || 0}%`}
          icon="chart"
          trend={+5}
          description="Your learning progress"
        />
        <StatCard
          title="Current Level"
          value={stats?.level || 1}
          icon="level"
          description="Keep learning to level up"
        />
        <StatCard
          title="Points"
          value={stats?.points || 0}
          icon="points"
          trend={+120}
          description="Points earned from activities"
        />
        <StatCard
          title="Resources Completed"
          value={stats?.completed_resources || 0}
          icon="book"
          trend={+2}
          description="Tutorials and exercises"
        />
      </div>
      
      {/* Learning Progress & Upcoming Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Learning Progress</h2>
            <ProgressChart 
              courses={enrolledCourses || []} 
            />
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Upcoming Assignments</h2>
            <div>
              {upcomingAssignments && 
               upcomingAssignments.length > 0 ? (
                upcomingAssignments.map((assignment: any) => (
                  <div key={assignment.id} className="mb-3 pb-3 border-b dark:border-gray-700">
                    <h3 className="font-medium dark:text-white">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Due: {assignment.due_date}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{assignment.course_title}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No upcoming assignments</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enrolled Courses & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnrolledCoursesList courses={enrolledCourses || []} />
        </div>
        
        <div>
          <ActivityFeed activities={recentActivities || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;