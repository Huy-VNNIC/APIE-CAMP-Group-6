import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// Thay đổi từ:
// import { DashboardLayout } from '../../layouts/DashboardLayout';
// Thành:
import DashboardLayout from '../../layouts/DashboardLayout';
import useAuth from '../../hooks/useAuth';
import studentApi from '../../api/student';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import VideoPlayer from '../../components/learning/VideoPlayer';
import CodeEditor from '../../components/learning/CodeEditor';
import SubmissionHistory from '../../components/learning/SubmissionHistory';

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const resourceId = parseInt(id || '0');
  const { user, currentDate } = useAuth();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'content' | 'submissions'>('content');
  
  useEffect(() => {
    const fetchResourceDetail = async () => {
      if (!resourceId) {
        setError('Invalid resource ID');
        setLoading(false);
        return;
      }
      
      try {
        const response = await studentApi.getResourceDetail(resourceId);
        
        if (response.success) {
          setResource(response.data);
        } else {
          setError(response.message || 'Failed to load resource details');
        }
      } catch (err) {
        console.error('Error fetching resource details:', err);
        setError('An error occurred while loading the resource');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResourceDetail();
  }, [resourceId]);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !resource) {
    return (
      <DashboardLayout>
        <div className="mb-4">
          <Link to="/learning/resources" className="text-primary-600 hover:text-primary-800 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Resources
          </Link>
        </div>
        <Alert type="error" message={error || 'Resource not found'} />
      </DashboardLayout>
    );
  }
  
  const renderResourceContent = () => {
    switch (resource.type) {
      case 'video':
        return (
          <VideoPlayer 
            url={resource.content} 
            title={resource.title} 
          />
        );
      case 'code':
        return (
          <CodeEditor 
            initialCode={resource.content} 
            language="javascript" 
            onSubmit={(code) => console.log('Code submitted:', code)} 
          />
        );
      case 'document':
        return (
          <div className="prose max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: resource.content }} />
          </div>
        );
      case 'quiz':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4">Quiz Content</h3>
            <p>Quiz interface would be implemented here</p>
          </div>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4">Unsupported Resource Type</h3>
            <p>This resource type is not supported in the preview.</p>
          </div>
        );
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-4">
        <Link to="/learning/resources" className="text-primary-600 hover:text-primary-800 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Resources
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{resource.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {resource.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md dark:bg-gray-700 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-2 dark:text-gray-400">
              <p>Created: {resource.created_at} | Author: {resource.author}</p>
              <p>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDate}</p>
              <p>Current User's Login: {user?.login || 'Huy-VNNIC'}</p>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-gray-600 dark:text-gray-300">{resource.description}</p>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Content
            </button>
            
            {resource.type === 'code' && (
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Submissions
              </button>
            )}
          </nav>
        </div>
      </div>
      
      <div>
        {activeTab === 'content' ? (
          renderResourceContent()
        ) : (
          <SubmissionHistory resourceId={resourceId} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResourceDetail;