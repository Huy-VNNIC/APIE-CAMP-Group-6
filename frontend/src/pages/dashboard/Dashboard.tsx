import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import studentApi from '../../api/student';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studentApi.getDashboard();
      
      if (response.success) {
        setDashboardData(response.data);
        // Hiệu ứng hoạt ảnh cho progress bar
        setTimeout(() => setShowProgress(true), 300);
      } else {
        setError(response.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const getActivityIcon = (type) => {
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

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
          padding: '3rem', 
          textAlign: 'center' 
        }}>
          <Loader />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <Alert type="error" message={error} />
        <button 
          onClick={fetchDashboardData} 
          style={{ 
            marginTop: '1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
          padding: '1rem' 
        }}>
          <p>No dashboard data available</p>
        </div>
      </div>
    );
  }

  const { dashboardData: progress, enrolledCourses, recentActivities } = dashboardData;

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '0 1rem',
      animation: 'fadeIn 0.5s ease forwards' 
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 700, 
          color: '#111827', 
          marginBottom: '0.5rem',
          position: 'relative',
          display: 'inline-block'
        }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', fontWeight: 400 }}>
          Welcome back, {user?.name || 'Student'}!
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
        marginBottom: '1.5rem',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>
            Overall Progress
          </h2>
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          <div style={{ 
            height: '10px', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '9999px', 
            overflow: 'hidden', 
            margin: '1rem 0' 
          }}>
            <div style={{ 
              height: '100%', 
              background: 'linear-gradient(90deg, #2563eb, #60a5fa)', 
              borderRadius: '9999px', 
              transition: 'width 1s ease-in-out',
              width: showProgress ? `${progress?.progress || 0}%` : '0%'
            }}></div>
          </div>
          <div style={{ 
            textAlign: 'center', 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            color: '#1d4ed8', 
            margin: '1rem 0' 
          }}>
            {progress?.progress || 0}%
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1rem',
          padding: '0 1.5rem 1.5rem 1.5rem'
        }}>
          <div style={{ 
            background: 'linear-gradient(145deg, #f9fafb, #f3f4f6)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              marginBottom: '0.5rem' 
            }}>
              Level
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#111827' }}>
              {progress?.level || 1}
            </div>
          </div>
          <div style={{ 
            background: 'linear-gradient(145deg, #f9fafb, #f3f4f6)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              marginBottom: '0.5rem' 
            }}>
              Points
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#111827' }}>
              {progress?.points || 0}
            </div>
          </div>
          <div style={{ 
            background: 'linear-gradient(145deg, #f9fafb, #f3f4f6)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              marginBottom: '0.5rem' 
            }}>
              Completed Resources
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#111827' }}>
              {progress?.completed_resources || 0}
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
            marginBottom: '1.5rem',
            overflow: 'hidden'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                Learning Resources
              </h2>
              <Link to="/resources" style={{ 
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center'
              }}>
                View All
                <span style={{ marginLeft: '0.25rem' }}>→</span>
              </Link>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1.5rem',
              padding: '1.5rem'
            }}>
              {enrolledCourses && enrolledCourses.length > 0 ? (
                enrolledCourses.map(course => (
                  <div key={course.id} style={{ 
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRadius: '9999px',
                      backgroundColor: course.status === 'completed' ? '#d1fae5' : 
                                      course.status === 'in_progress' ? '#fef3c7' : '#dbeafe',
                      color: course.status === 'completed' ? '#065f46' : 
                             course.status === 'in_progress' ? '#92400e' : '#1e40af'
                    }}>
                      {course.status ? (
                        course.status.charAt(0).toUpperCase() + course.status.slice(1)
                      ) : (
                        'Not Started'
                      )}
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 600, 
                        color: '#111827', 
                        marginBottom: '0.25rem' 
                      }}>
                        {course.title}
                      </h3>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280', 
                        marginBottom: '1rem',
                        height: '40px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {course.description}
                      </p>
                      
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          marginBottom: '0.25rem' 
                        }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Progress</span>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 600, 
                            color: '#1d4ed8' 
                          }}>
                            {course.progress}%
                          </span>
                        </div>
                        <div style={{ 
                          height: '6px', 
                          backgroundColor: '#e5e7eb', 
                          borderRadius: '9999px', 
                          overflow: 'hidden', 
                          marginBottom: '1rem' 
                        }}>
                          <div style={{ 
                            height: '100%', 
                            borderRadius: '9999px', 
                            transition: 'width 0.5s ease',
                            width: `${course.progress}%`,
                            backgroundColor: course.progress >= 70 ? '#10b981' : 
                                           course.progress >= 40 ? '#f59e0b' : '#3b82f6'
                          }}></div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid #e5e7eb',
                        marginTop: '0.5rem'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Last accessed: {formatDate(course.last_accessed)}
                        </div>
                        <Link to={`/resources/${course.id}`} style={{ 
                          backgroundColor: '#2563eb',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          Continue
                          <span style={{ marginLeft: '0.25rem' }}>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '2rem' 
                }}>
                  <p>No resources accessed yet. Start exploring!</p>
                  <Link to="/resources" style={{ 
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    marginTop: '1rem'
                  }}>
                    Browse Resources
                    <span style={{ marginLeft: '0.25rem' }}>→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
            marginBottom: '1.5rem',
            overflow: 'hidden'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                Recent Activities
              </h2>
              <Link to="/activities" style={{ 
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center'
              }}>
                View All
                <span style={{ marginLeft: '0.25rem' }}>→</span>
              </Link>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              {recentActivities && recentActivities.length > 0 ? (
                recentActivities.map(activity => (
                  <div key={activity.id} style={{ 
                    display: 'flex', 
                    padding: '1rem 0', 
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'background-color 0.2s'
                  }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginRight: '1rem', 
                      backgroundColor: '#dbeafe', 
                      color: '#2563eb', 
                      fontSize: '1.25rem' 
                    }}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: '#1f2937', 
                        fontWeight: 500 
                      }}>
                        {activity.description}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        marginTop: '0.25rem' 
                      }}>
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', padding: '2rem' }}>
                  No recent activities yet.
                </p>
              )}
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
            marginBottom: '1.5rem',
            overflow: 'hidden'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                Quick Stats
              </h2>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.5rem 0', 
                borderBottom: '1px dashed #e5e7eb' 
              }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Viewed Resources:</span>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: '#111827' 
                }}>
                  {enrolledCourses?.filter(c => c.status === 'viewed').length || 0}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.5rem 0', 
                borderBottom: '1px dashed #e5e7eb' 
              }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>In Progress:</span>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: '#111827' 
                }}>
                  {enrolledCourses?.filter(c => c.status === 'in_progress').length || 0}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.5rem 0' 
              }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completed:</span>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: '#111827' 
                }}>
                  {enrolledCourses?.filter(c => c.status === 'completed').length || 0}
                </span>
              </div>
              
              <Link to="/progress" style={{ 
                display: 'block',
                width: '100%',
                textAlign: 'center',
                marginTop: '1rem',
                padding: '0.5rem 0',
                backgroundColor: '#f3f4f6',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}>
                View Detailed Progress
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;