import React from 'react';
import { Link } from 'react-router-dom';
import studentApi from '../../api/student';

interface EnrolledCourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    progress: number;
    last_accessed: string;
    status: 'viewed' | 'in_progress' | 'completed' | null;
  };
  onProgressUpdate?: () => void;
}

const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({ course, onProgressUpdate }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  
  const getStatusLabel = (status: string | null) => {
    switch(status) {
      case 'viewed':
        return 'Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Not Started';
    }
  };
  
  const getStatusColor = (status: string | null) => {
    switch(status) {
      case 'viewed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleContinueLearning = async () => {
    try {
      // Cập nhật trạng thái tùy thuộc vào trạng thái hiện tại
      let newStatus: 'viewed' | 'in_progress' | 'completed';
      
      if (!course.status || course.status === 'viewed') {
        newStatus = 'in_progress';
      } else if (course.status === 'in_progress') {
        newStatus = 'completed';
      } else {
        // Nếu đã completed thì giữ nguyên
        newStatus = 'completed';
      }
      
      await studentApi.updateResourceProgress(course.id, newStatus);
      
      if (onProgressUpdate) {
        onProgressUpdate();
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      alert('Failed to update progress. Please try again.');
    }
  };

  return (
    <div className="course-card">
      <div className="course-content">
        <div className="flex justify-between items-start mb-2">
          <h3 className="course-title">{course.title}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
            {getStatusLabel(course.status)}
          </span>
        </div>
        <p className="course-description">{course.description}</p>
        
        <div className="course-progress">
          <div className="flex justify-between mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${
                course.progress >= 70 ? 'bg-success' : 
                course.progress >= 40 ? 'bg-warning' : 
                'bg-primary'
              }`}
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="course-footer">
          <span>{course.last_accessed ? `Last accessed: ${formatDate(course.last_accessed)}` : 'Not started yet'}</span>
          <div className="flex gap-2">
            <Link to={`/resources/${course.id}`} className="btn btn-secondary btn-sm">
              View
            </Link>
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleContinueLearning}
            >
              {!course.status ? 'Start' : 
               course.status === 'completed' ? 'Review' : 
               'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;