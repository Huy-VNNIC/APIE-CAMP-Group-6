import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import studentApi from '../../api/student';
import DashboardLayout from '../../layouts/DashboardLayout';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import ResourceCard from '../../components/learning/ResourceCard';
import SearchFilter from '../../components/learning/SearchFilter';

const Resources: React.FC = () => {
  const { user, currentDate } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState({
    type: 'all',
    searchQuery: ''
  });
  
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await studentApi.getLearningResources();
        
        if (response.success) {
          setResources(response.data);
        } else {
          setError('Failed to load resources');
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('An error occurred while loading resources');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);
  
  // Filter resources based on type and search query
  const filteredResources = resources.filter(resource => {
    const matchesType = filters.type === 'all' || resource.type === filters.type;
    const matchesSearch = filters.searchQuery === '' ||
      resource.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    return matchesType && matchesSearch;
  });
  
  const handleFilterChange = (type: string) => {
    setFilters({
      ...filters,
      type
    });
  };
  
  const handleSearchChange = (searchQuery: string) => {
    setFilters({
      ...filters,
      searchQuery
    });
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }
  
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
        </div>
      </div>
      
      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}
      
      <SearchFilter 
        selectedType={filters.type}
        searchQuery={filters.searchQuery}
        onTypeChange={handleFilterChange}
        onSearchChange={handleSearchChange}
      />
      
      <div className="mt-6">
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow dark:bg-gray-800">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No resources found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Resources;