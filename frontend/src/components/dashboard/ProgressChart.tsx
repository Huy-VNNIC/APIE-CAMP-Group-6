import React from 'react';
import { Course } from '../../types/student.types';

interface ProgressChartProps {
  courses: Course[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ courses }) => {
  // Trong thực tế, bạn sẽ sử dụng thư viện Chart.js hoặc Recharts
  // Ở đây chúng ta sẽ làm một biểu đồ đơn giản với CSS
  
  return (
    <div className="space-y-4">
      {courses.length > 0 ? (
        courses.map(course => (
          <div key={course.id} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{course.title}</span>
              <span className="text-sm font-medium text-gray-700">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last accessed: {course.last_accessed}
            </p>
          </div>
        ))
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No courses enrolled</p>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;