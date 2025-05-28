import React from 'react';

interface ActivityItemProps {
  activity: {
    id: number;
    type: string;
    description: string;
    timestamp: string;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
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

  return (
    <div className="activity-item" style={{ 
      padding: '0.75rem 0', 
      borderBottom: '1px solid var(--gray-200)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem'
    }}>
      <div style={{ 
        width: '2rem',
        height: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: getActivityColor(activity.type) + '20', // Add transparency
        color: getActivityColor(activity.type),
        borderRadius: '50%',
        flexShrink: 0
      }}>
        {getActivityIcon(activity.type)}
      </div>
      
      <div>
        <p style={{ margin: '0', fontWeight: '500', color: 'var(--gray-800)' }}>
          {activity.description}
        </p>
        <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          {formatDate(activity.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ActivityItem;