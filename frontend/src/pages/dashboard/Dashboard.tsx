import React, { useEffect, useState } from 'react';
import studentApi from '../../api/student';
import useAuth from '../../hooks/useAuth';

interface DashboardData {
  dashboardData: {
    progress: number;
    level: number;
    points: number;
    completed_resources: number;
  };
  enrolledCourses: Array<{
    id: number;
    title: string;
    description: string;
    progress: number;
    last_accessed: string;
  }>;
  recentActivities: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await studentApi.getDashboard();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || 'Error fetching dashboard data');
        }
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loader"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card" style={{ borderLeft: '4px solid var(--danger)', padding: '1rem' }}>
          <h2 style={{ color: 'var(--danger)' }}>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container">
        <div className="card">
          <p>No dashboard data available</p>
        </div>
      </div>
    );
  }

  const { dashboardData: progress, enrolledCourses, recentActivities } = dashboardData;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="section-title">Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name || 'Student'}!</p>
      </div>
      
      <div className="card">
        <h2 className="section-title">Overall Progress</h2>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress?.progress || 0}%` }}
            ></div>
          </div>
          <div className="progress-percentage">{progress?.progress || 0}%</div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Level</div>
            <div className="stat-value">{progress?.level || 1}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Points</div>
            <div className="stat-value">{progress?.points || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Completed Resources</div>
            <div className="stat-value">{progress?.completed_resources || 0}</div>
          </div>
        </div>
      </div>
      
      <div className="two-column">
        <div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="section-title">Enrolled Courses</h2>
            </div>
            
            {enrolledCourses && enrolledCourses.length > 0 ? (
              <div className="courses-grid">
                {enrolledCourses.map(course => (
                  <div className="course-card" key={course.id}>
                    <div className="course-content">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-description">{course.description}</p>
                      <div className="course-progress">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${
                              course.progress >= 70 ? 'bg-success' : 
                              course.progress >= 40 ? 'bg-warning' : 
                              'bg-primary'
                            }`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="course-footer">
                        <span>Last accessed: {formatDate(course.last_accessed)}</span>
                        <button className="btn btn-primary">Continue</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No courses enrolled yet.</p>
            )}
          </div>
        </div>
        
        <div>
          <div className="card">
            <h2 className="section-title">Recent Activities</h2>
            
            {recentActivities && recentActivities.length > 0 ? (
              <div className="activities-list">
                {recentActivities.map(activity => (
                  <div className="activity-item" key={activity.id}>
                    <div className="activity-content">{activity.description}</div>
                    <div className="activity-time">{formatDate(activity.timestamp)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent activities.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;