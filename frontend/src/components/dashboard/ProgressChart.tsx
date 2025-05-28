import React from 'react';

interface Course {
  id: number;
  title: string;
  progress: number;
}

interface ProgressChartProps {
  courses: Course[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ courses }) => {
  return (
    <div>
      {courses.length > 0 ? (
        <div className="space-y-6">
          {courses.map(course => (
            <div key={course.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{course.title}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className={`h-2.5 rounded-full ${
                    course.progress < 30 
                      ? 'bg-red-600 dark:bg-red-500' 
                      : course.progress < 70 
                        ? 'bg-yellow-600 dark:bg-yellow-500' 
                        : 'bg-green-600 dark:bg-green-500'
                  }`} 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No courses available</p>
      )}
    </div>
  );
};

export default ProgressChart;