import React from 'react';

interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  // Hàm để lấy icon dựa trên loại hoạt động
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_progress':
        return (
          <div className="bg-blue-100 rounded-full p-2 dark:bg-blue-900/30">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'assignment_submission':
        return (
          <div className="bg-green-100 rounded-full p-2 dark:bg-green-900/30">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-full p-2 dark:bg-gray-700">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h2>
      
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start space-x-3">
              {getActivityIcon(activity.type)}
              
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">{activity.description}</p>
                <span className="text-xs text-gray-500 dark:text-gray-500">{activity.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
      )}
    </div>
  );
};

export default ActivityFeed;