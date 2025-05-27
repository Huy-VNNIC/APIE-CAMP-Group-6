import React from 'react';
import { Course } from '../../types/student.types';

interface RecentResourcesProps {
  courses: Course[];
}

const RecentResources: React.FC<RecentResourcesProps> = ({ courses }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Resources</h2>
      
      {courses && courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id} className="border-b pb-4 last:border-b-0">
              <h3 className="font-medium">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">Last accessed: {course.last_accessed}</span>
                <a href={`/courses/${course.id}`} className="text-sm text-blue-600">Continue</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recent resources available</p>
      )}
    </div>
  );
};

export default RecentResources;