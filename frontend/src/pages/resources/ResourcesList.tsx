import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import studentApi from '../../api/student';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

interface Resource {
  id: number;
  title: string;
  type: string;
  language: string;
  url: string;
  status: 'viewed' | 'in_progress' | 'completed' | null;
  last_accessed: string | null;
}

const ResourcesList: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await studentApi.getResources();
        if (response.success) {
          setResources(response.data);
        } else {
          setError(response.message || 'Failed to fetch resources');
        }
      } catch (err: any) {
        console.error('Resources error:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleUpdateProgress = async (resourceId: number, status: 'viewed' | 'in_progress' | 'completed') => {
    try {
      const response = await studentApi.updateResourceProgress(resourceId, status);
      if (response.success) {
        // Cập nhật trạng thái trong danh sách resources
        setResources(prevResources => 
          prevResources.map(resource => 
            resource.id === resourceId 
              ? { ...resource, status, last_accessed: new Date().toISOString() } 
              : resource
          )
        );
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
      alert('Failed to update progress. Please try again.');
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch(type) {
      case 'video':
        return '🎥';
      case 'ebook':
        return '📚';
      case 'slide':
        return '📊';
      case 'code':
        return '💻';
      default:
        return '📄';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
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
  
  const filteredResources = resources.filter(resource => {
    // Filter by status
    if (filter !== 'all' && resource.status !== filter) {
      return false;
    }
    
    // Filter by search term
    if (search && !resource.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader />
          <p>Loading resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="section-title">Learning Resources</h1>
        <p className="welcome-text">Track your progress with our learning materials</p>
      </div>
      
      <div className="card">
        <div className="filters" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <button 
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
              style={{ marginRight: '0.5rem' }}
            >
              All
            </button>
            <button 
              className={`btn ${filter === 'viewed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('viewed')}
              style={{ marginRight: '0.5rem' }}
            >
              Started
            </button>
            <button 
              className={`btn ${filter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('in_progress')}
              style={{ marginRight: '0.5rem' }}
            >
              In Progress
            </button>
            <button 
              className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                padding: '0.5rem', 
                border: '1px solid var(--gray-300)', 
                borderRadius: '0.25rem',
                width: '250px'
              }}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>Language</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>Last Accessed</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.length > 0 ? (
                filteredResources.map(resource => (
                  <tr key={resource.id}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>
                      <Link to={`/resources/${resource.id}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>
                        {resource.title}
                      </Link>
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>
                      {getResourceTypeIcon(resource.type)} {resource.type}
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>{resource.language}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>
                      <span 
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(resource.status)}`}
                        style={{ display: 'inline-block' }}
                      >
                        {getStatusLabel(resource.status)}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>
                      {formatDate(resource.last_accessed)}
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link 
                          to={`/resources/${resource.id}`} 
                          className="btn btn-primary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          View
                        </Link>
                        
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => {
                            const currentStatus = resource.status || 'viewed';
                            const nextStatus = 
                              currentStatus === 'viewed' ? 'in_progress' : 
                              currentStatus === 'in_progress' ? 'completed' : 
                              'completed';
                            
                            handleUpdateProgress(resource.id, nextStatus);
                          }}
                        >
                          {!resource.status ? 'Mark Started' : 
                           resource.status === 'viewed' ? 'Mark In Progress' : 
                           resource.status === 'in_progress' ? 'Mark Completed' : 
                           'Completed ✓'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No resources found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResourcesList;