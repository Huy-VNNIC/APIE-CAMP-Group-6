import React from 'react';

interface EnrolledCourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    progress: number;
    last_accessed: string;
  };
}

const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({ course }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'from-red-400 to-red-500';
    if (progress < 70) return 'from-yellow-400 to-yellow-500';
    return 'from-green-400 to-green-500';
  };

  return (
    <div className="course-card fade-in card-hover">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course.title}</h3>
          
          <span 
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              course.progress >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
              course.progress >= 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}
          >
            {course.progress >= 80 ? 'Advanced' : course.progress >= 40 ? 'In Progress' : 'Started'}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{course.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-bar-fill bg-gradient-to-r ${getProgressColor(course.progress)}`} 
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Last accessed: {formatDate(course.last_accessed)}
          </p>
          
          <button className="btn-primary text-xs flex items-center">
            <span>Continue</span>
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;