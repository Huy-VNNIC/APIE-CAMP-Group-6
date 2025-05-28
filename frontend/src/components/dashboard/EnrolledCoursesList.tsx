import React from 'react';
import { Link } from 'react-router-dom';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  last_accessed: string;
}

interface EnrolledCoursesListProps {
  courses: Course[];
}

const EnrolledCoursesList: React.FC<EnrolledCoursesListProps> = ({ courses }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">Your Enrolled Courses</h2>
        <Link to="/courses" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
          View all
        </Link>
      </div>
      
      {courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id} className="border-b pb-4 last:border-b-0 dark:border-gray-700">
              <div className="flex justify-between">
                <h3 className="font-medium dark:text-white">{course.title}</h3>
                <span className="text-sm text-primary-600 dark:text-primary-400">{course.progress}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">{course.description}</p>
              
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full dark:bg-primary-500" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-500">Last accessed: {course.last_accessed}</span>
                <Link 
                  to={`/courses/${course.id}`} 
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline"
                >
                  Continue
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">No courses enrolled yet</p>
          <Link 
            to="/courses/browse" 
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default EnrolledCoursesList;