import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import studentApi from '../../api/student';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

const RecentActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await studentApi.getRecentActivities();
        
        if (response.success) {
          setActivities(response.data);
        } else {
          setError(response.message || 'Failed to fetch activities');
        }
      } catch (err: any) {
        console.error('Activities error:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'course_access':
        return '👀';
      case 'course_progress':
        return '🔄';
      case 'course_completion':
        return '✅';
      case 'assignment_submission':
        return '📝';
      case 'assignment_success':
        return '🎉';
      case 'assignment_failed':
        return '⚠️';
      default:
        return '📋';
    }
  };
  
  const getActivityColor = (type: string) => {
    if (type.includes('completion') || type.includes('success')) {
      return 'var(--success)';
    }
    if (type.includes('failed')) {
      return 'var(--danger)';
    }
    if (type.includes('progress')) {
      return 'var(--warning)';
    }
    return 'var(--primary)';
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type.includes(filter);
  });

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader />
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Alert type="error" message={error} />
      </div>
    );
  }

  // Group activities by day
  const groupedActivities: { [key: string]: Activity[] } = {};
  filteredActivities.forEach(activity => {
    const date = new Date(activity.timestamp);
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    
    if (!groupedActivities[dateKey]) {
      groupedActivities[dateKey] = [];
    }
    
    groupedActivities[dateKey].push(activity);
  });

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="section-title">Recent Activities</h1>
        <p className="welcome-text">Track your learning progress over time</p>
      </div>
      
      <div className="card">
        <div className="filters" style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', paddingBottom: '1rem', padding: '1rem' }}>
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
            style={{ marginRight: '0.5rem' }}
          >
            All
          </button>
          <button 
            className={`btn ${filter === 'course' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('course')}
            style={{ marginRight: '0.5rem' }}
          >
            Course Activities
          </button>
          <button 
            className={`btn ${filter === 'assignment' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('assignment')}
          >
            Assignments
          </button>
        </div>
        
        {Object.keys(groupedActivities).length > 0 ? (
          <div className="timeline" style={{ padding: '1.5rem' }}>
            {Object.keys(groupedActivities).map(dateKey => {
              const firstActivity = groupedActivities[dateKey][0];
              const date = new Date(firstActivity.timestamp);
              const formattedDate = date.toLocaleDateString(undefined, { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              });
              
              return (
                <div key={dateKey} className="timeline-day" style={{ marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontWeight: '500', color: 'var(--gray-600)' }}>{formattedDate}</h3>
                  
                  <div className="timeline-items" style={{ borderLeft: '2px solid var(--gray-200)', paddingLeft: '1.5rem' }}>
                    {groupedActivities[dateKey].map((activity, index) => (
                      <div 
                        key={activity.id}
                        className="timeline-item"
                        style={{ 
                          position: 'relative',
                          marginBottom: '1.5rem',
                          paddingBottom: '1rem',
                          borderBottom: index === groupedActivities[dateKey].length - 1 ? 'none' : '1px solid var(--gray-200)'
                        }}
                      >
                        {/* Icon circle */}
                        <div 
                          style={{ 
                            position: 'absolute',
                            left: '-2rem',
                            width: '1.75rem',
                            height: '1.75rem',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            border: `2px solid ${getActivityColor(activity.type)}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '0'
                          }}
                        >
                          <span>{getActivityIcon(activity.type)}</span>
                        </div>
                        
                        {/* Activity content */}
                        <div style={{ marginLeft: '0.5rem' }}>
                          <p style={{ 
                            margin: '0',
                            fontWeight: '500',
                            color: getActivityColor(activity.type)
                          }}>
                            {activity.description}
                          </p>
                          
                          <span style={{ 
                            fontSize: '0.875rem',
                            color: 'var(--gray-500)'
                          }}>
                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No activities found</h3>
            <p style={{ color: 'var(--gray-500)' }}>
              No activities matching your filter. Try changing the filter or start learning.
            </p>
            <Link to="/resources" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Browse Resources
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;