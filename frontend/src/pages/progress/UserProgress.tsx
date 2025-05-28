import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import studentApi from '../../api/student';
import Loader from '../../components/common/Loader';
import ProgressChart from '../../components/dashboard/ProgressChart';

interface ProgressStats {
  overall: {
    progress: number;
    level: number;
    points: number;
    completed_resources: number;
  };
  resources: {
    viewed: number;
    in_progress: number;
    completed: number;
  };
  submissions: {
    pending: number;
    success: number;
    failed: number;
  };
}

interface CompletedResource {
  id: number;
  title: string;
  type: string;
  language: string;
  last_accessed: string;
}

const UserProgress: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [completedResources, setCompletedResources] = useState<CompletedResource[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch progress stats
        const progressResponse = await studentApi.getProgress();
        if (progressResponse.success) {
          setStats(progressResponse.data);
        }
        
        // Fetch completed resources
        const completedResponse = await studentApi.getCompletedResources();
        if (completedResponse.success) {
          setCompletedResources(completedResponse.data);
        }
        
        // Fetch recent activities
        const activitiesResponse = await studentApi.getRecentActivities();
        if (activitiesResponse.success) {
          setActivities(activitiesResponse.data);
        }
      } catch (err: any) {
        console.error('Progress data error:', err);
        setError(err.message || 'An error occurred while fetching progress data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };
  
  const getResourceTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return '🎥';
      case 'ebook': return '📚';
      case 'slide': return '📊';
      case 'code': return '💻';
      default: return '📄';
    }
  };
  
  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader />
          <p>Loading progress data...</p>
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
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="container">
        <div className="card">
          <p>No progress data available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="section-title">Learning Progress</h1>
        <p className="welcome-text">Track your learning journey and achievements</p>
      </div>
      
      <div className="card">
        <h2 className="section-title">Overall Progress</h2>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats.overall.progress}%` }}
            ></div>
          </div>
          <div className="progress-percentage">{stats.overall.progress}%</div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Level</div>
            <div className="stat-value">{stats.overall.level}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Points</div>
            <div className="stat-value">{stats.overall.points}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Completed Resources</div>
            <div className="stat-value">{stats.overall.completed_resources}</div>
          </div>
        </div>
      </div>
      
      <div className="two-column">
        <div>
          <div className="card">
            <h2 className="section-title">Resource Progress</h2>
            
            <div style={{ display: 'flex', height: '300px' }}>
              <div style={{ flex: '1', minWidth: '0' }}>
                <ProgressChart 
                  completed={stats.resources.completed} 
                  inProgress={stats.resources.in_progress} 
                  viewed={stats.resources.viewed} 
                />
              </div>
              
              <div style={{ flex: '1', minWidth: '0', padding: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Resource Statistics</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Viewed:</span>
                    <span>{stats.resources.viewed}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>In Progress:</span>
                    <span>{stats.resources.in_progress}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Completed:</span>
                    <span>{stats.resources.completed}</span>
                  </div>
                </div>
                
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Submission Statistics</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Pending:</span>
                    <span>{stats.submissions.pending}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Success:</span>
                    <span>{stats.submissions.success}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Failed:</span>
                    <span>{stats.submissions.failed}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link to="/resources" className="btn btn-primary">View All Resources</Link>
            </div>
          </div>
          
          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title">Completed Resources</h2>
            </div>
            
            {completedResources.length > 0 ? (
              <div className="completed-resources">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>Title</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>Type</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>Completed On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedResources.map(resource => (
                      <tr key={resource.id}>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>
                          <Link 
                            to={`/resources/${resource.id}`}
                            style={{ color: 'var(--primary)', fontWeight: 500 }}
                          >
                            {resource.title}
                          </Link>
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>
                          {getResourceTypeIcon(resource.type)} {resource.type}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>
                          {formatDate(resource.last_accessed)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ padding: '1rem', textAlign: 'center' }}>You haven't completed any resources yet.</p>
            )}
          </div>
        </div>
        
        <div>
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title">Recent Activities</h2>
            </div>
            
            {activities.length > 0 ? (
              <div className="activities-list">
                {activities.map((activity: any) => (
                  <div 
                    key={activity.id}
                    className="activity-item"
                    style={{ 
                      padding: '1rem',
                      borderBottom: '1px solid var(--gray-200)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ 
                      color: 
                        activity.type.includes('completion') ? 'var(--success)' :
                        activity.type.includes('progress') ? 'var(--warning)' :
                        'var(--primary)'
                    }}>
                      {activity.description}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ padding: '1rem', textAlign: 'center' }}>No recent activities found.</p>
            )}
          </div>
          
          <div className="card" style={{ marginTop: '1rem' }}>
            <h2 className="section-title">Next Steps</h2>
            <div style={{ padding: '1rem' }}>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    to="/resources"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: 'var(--gray-100)',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      color: 'var(--gray-800)'
                    }}
                  >
                    <span style={{ marginRight: '0.5rem' }}>📚</span>
                    <span>Browse more learning resources</span>
                  </Link>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    to="/resources"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: 'var(--gray-100)',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      color: 'var(--gray-800)'
                    }}
                  >
                    <span style={{ marginRight: '0.5rem' }}>📊</span>
                    <span>Practice with coding challenges</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: 'var(--gray-100)',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      color: 'var(--gray-800)'
                    }}
                  >
                    <span style={{ marginRight: '0.5rem' }}>👤</span>
                    <span>Update your profile</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgress;