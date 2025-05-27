import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
// Thay đổi từ:
// import { getLearningResources } from '../../api/student';
// Thành:
import studentApi from '../../api/student';
import DashboardLayout from '../../layouts/DashboardLayout';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import { Resource } from '../../types/student.types';

const Resources: React.FC = () => {
  const { user, currentDate } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Thay đổi từ:
        // const response = await getLearningResources();
        // Thành:
        const response = await studentApi.getLearningResources();
        
        if (response.success) {
          setResources(response.data);
        } else {
          setError('Failed to load resources');
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('An error occurred while loading the resources');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);
  
  const filteredResources = resources.filter(resource => {
    const matchesFilter = selectedFilter === 'all' || resource.type === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });
  
  const renderResourceCard = (resource: Resource) => {
    const getIcon = () => {
      switch (resource.type) {
        case 'video':
          return (
            <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'code':
          return (
            <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          );
        case 'document':
          return (
            <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          );
        case 'quiz':
          return (
            <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          );
        default:
          return (
            <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          );
      }
    };
    
    return (
      <Link 
        to={`/learning/resources/${resource.id}`} 
        key={resource.id}
        className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="p-5">
          <div className="flex items-center mb-3">
            <div className="mr-3">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{resource.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.created_at}
              </p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3 dark:text-gray-300">{resource.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {resource.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md dark:bg-gray-700 dark:text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Learning Resources</h1>
            <div className="text-sm text-gray-600 mt-1 dark:text-gray-400">
              <p>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDate}</p>
              <p>Current User's Login: {user?.login || 'Huy-VNNIC'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedFilter === 'all' 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter('video')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedFilter === 'video' 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setSelectedFilter('code')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedFilter === 'code' 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Coding Challenges
          </button>
          <button
            onClick={() => setSelectedFilter('document')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedFilter === 'document' 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setSelectedFilter('quiz')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedFilter === 'quiz' 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Quizzes
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map(resource => renderResourceCard(resource))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No resources found. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Resources;