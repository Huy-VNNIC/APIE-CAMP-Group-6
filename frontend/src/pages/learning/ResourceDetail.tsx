import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  
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
  
  const handleCodeSubmit = async (code: string) => {
    if (!resource) return;
    
    setSubmitting(true);
    setSubmitResult(null);
    
    try {
      // Giả định có API endpoint cho việc submit code
      const response = await studentApi.submitCode(resourceId, code);
      
      if (response.success) {
        setSubmitResult({
          status: 'success',
          message: 'Code submitted successfully',
          result: response.data
        });
      } else {
        setSubmitResult({
          status: 'error',
          message: response.message || 'Failed to submit code'
        });
      }
    } catch (err: any) {
      console.error('Error submitting code:', err);
      setSubmitResult({
        status: 'error',
        message: err.message || 'An error occurred while submitting your code'
      });
    } finally {
      setSubmitting(false);
    }
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
  
  if (error || !resource) {
    return (
      <DashboardLayout>
        <div className="mb-4">
          <Link to="/learning/resources" className="text-primary-600 hover:text-primary-800 flex items-center dark:text-primary-400 dark:hover:text-primary-300">
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
          <>
            <CodeEditor 
              initialCode={resource.content} 
              language={resource.language || 'javascript'} 
              onSubmit={handleCodeSubmit}
              submitting={submitting}
            />
            {submitResult && (
              <div className="mt-4">
                <Alert 
                  type={submitResult.status === 'success' ? 'success' : 'error'} 
                  message={submitResult.message}
                  onClose={() => setSubmitResult(null)}
                />
                {submitResult.status === 'success' && submitResult.result && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-md dark:bg-gray-700">
                    <h4 className="text-md font-medium mb-2 dark:text-white">Result:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto dark:bg-gray-800 dark:text-gray-300">
                      {submitResult.result.output || 'No output'}
                    </pre>
                    {submitResult.result.error && (
                      <div className="mt-2">
                        <h4 className="text-md font-medium mb-2 text-red-600 dark:text-red-400">Error:</h4>
                        <pre className="bg-red-50 p-3 rounded text-sm overflow-auto text-red-600 dark:bg-red-900/30 dark:text-red-400">
                          {submitResult.result.error}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        );
      case 'document':
        return (
          <div className="prose max-w-none dark:prose-invert">
            <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800" dangerouslySetInnerHTML={{ __html: resource.content }} />
          </div>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Unsupported Resource Type</h3>
            <p className="dark:text-gray-300">This resource type is not supported in the preview.</p>
          </div>
        );
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-4">
        <Link to="/learning/resources" className="text-primary-600 hover:text-primary-800 flex items-center dark:text-primary-400 dark:hover:text-primary-300">
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
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {resource.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md dark:bg-gray-700 dark:text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="text-sm text-gray-600 mt-2 dark:text-gray-400">
              <p>Created: {resource.created_at} | Author: {resource.author}</p>
              <p>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDate}</p>
              <p>Current User's Login: {user?.login || 'Huy-VNNIC'}</p>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-gray-600 dark:text-gray-300">{resource.description}</p>
      </div>
      
      {resource.type === 'code' && (
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
                Code Editor
              </button>
              
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Submission History
              </button>
            </nav>
          </div>
        </div>
      )}
      
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