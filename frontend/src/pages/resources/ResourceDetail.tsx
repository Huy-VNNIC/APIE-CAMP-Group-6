import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// Xóa import MonacoEditor from "react-monaco-editor";
import studentApi from '../../api/student';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

interface Resource {
  id: number;
  title: string;
  type: string;
  language: string;
  url: string;
  created_by_name: string;
  created_at: string;
  study_status: 'viewed' | 'in_progress' | 'completed';
  last_accessed: string;
}

interface Submission {
  id: number;
  code: string;
  result: string;
  status: string;
  submitted_at: string;
}

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [code, setCode] = useState<string>('// Write your code here\nconsole.log("Hello World");');
  const [language, setLanguage] = useState<string>('javascript');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchResourceDetail = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        const response = await studentApi.getResourceDetail(Number(id));
        
        if (response.success) {
          setResource(response.data);
          setLanguage(response.data.language || 'javascript');
          
          // Fetch submission history
          const submissionsResponse = await studentApi.getSubmissionHistory(Number(id));
          if (submissionsResponse.success) {
            setSubmissions(submissionsResponse.data);
            
            // If there are submissions, pre-fill the editor with the latest code
            if (submissionsResponse.data.length > 0) {
              setCode(submissionsResponse.data[0].code);
            }
          }
        } else {
          setError(response.message || 'Failed to fetch resource');
        }
      } catch (err: any) {
        console.error('Resource detail error:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResourceDetail();
  }, [id]);

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setResult(null);
      
      const response = await studentApi.submitCode(Number(id), code, language);
      
      if (response.success) {
        setResult(response.data);
        
        // Update the submission list
        setSubmissions(prev => [response.data, ...prev]);
        
        // Update resource status
        if (resource) {
          // If this is the first submission or still in 'viewed' status
          if (resource.study_status === 'viewed') {
            await studentApi.updateResourceProgress(Number(id), 'in_progress');
            setResource({
              ...resource, 
              study_status: 'in_progress'
            });
          }
          
          // Check if we should mark as completed (e.g., after 3 successful submissions)
          const successfulSubmissions = submissions.filter(s => s.status === 'success').length;
          if (successfulSubmissions >= 2 && resource.study_status !== 'completed') {
            await studentApi.updateResourceProgress(Number(id), 'completed');
            setResource({
              ...resource, 
              study_status: 'completed'
            });
          }
        }
      } else {
        setError(response.message || 'Submission failed');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const loadSubmission = (submission: Submission) => {
    setCode(submission.code);
    setShowHistory(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'viewed':
        return <span className="badge badge-blue">Started</span>;
      case 'in_progress':
        return <span className="badge badge-yellow">In Progress</span>;
      case 'completed':
        return <span className="badge badge-green">Completed</span>;
      default:
        return <span className="badge badge-gray">Not Started</span>;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader />
          <p>Loading resource...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Alert type="error" message={error} />
        <div style={{ marginTop: '1rem' }}>
          <Link to="/resources" className="btn btn-primary">Back to Resources</Link>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="container">
        <Alert type="info" message="Resource not found" />
        <div style={{ marginTop: '1rem' }}>
          <Link to="/resources" className="btn btn-primary">Back to Resources</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="breadcrumbs" style={{ marginBottom: '1rem' }}>
        <Link to="/resources" className="btn btn-link">Resources</Link>
        <span> / </span>
        <span>{resource.title}</span>
      </div>
      
      <div className="resource-header card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="section-title">
              {getResourceTypeIcon(resource.type)} {resource.title}
            </h1>
            <div className="resource-meta" style={{ marginTop: '0.5rem' }}>
              <span>Type: <strong>{resource.type}</strong></span>
              <span style={{ margin: '0 1rem' }}>•</span>
              <span>Language: <strong>{resource.language}</strong></span>
              <span style={{ margin: '0 1rem' }}>•</span>
              <span>Created by: <strong>{resource.created_by_name}</strong></span>
            </div>
          </div>
          
          <div>
            {getStatusBadge(resource.study_status)}
          </div>
        </div>
        
        {resource.url && (
          <div className="resource-url" style={{ marginTop: '1rem' }}>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              View Original Resource
            </a>
          </div>
        )}
      </div>
      
      {resource.type === 'code' && (
        <>
          <div className="card" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '1rem 1rem 0 1rem' }}>
              <h2 className="section-title">Code Editor</h2>
              
              <div className="actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select 
                  value={language} 
                  onChange={handleLanguageChange}
                  style={{ 
                    padding: '0.5rem', 
                    border: '1px solid var(--gray-300)', 
                    borderRadius: '0.25rem' 
                  }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                </select>
                
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? 'Hide History' : 'Show History'}
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', padding: '0 1rem 1rem 1rem' }}>
              <div style={{ flex: showHistory ? '2' : '1', minWidth: '0' }}>
                <div style={{ border: '1px solid var(--gray-300)', borderRadius: '0.25rem', height: '400px' }}>
                  {/* Replace Monaco Editor with textarea */}
                  <textarea
                    value={code}
                    onChange={handleEditorChange}
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: '1rem',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      border: 'none',
                      resize: 'none',
                      backgroundColor: '#1e1e1e',
                      color: '#d4d4d4',
                      lineHeight: '1.5',
                      outline: 'none'
                    }}
                    spellCheck="false"
                  />
                </div>
                
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setCode('// Write your code here\nconsole.log("Hello World");')}
                  >
                    Reset Code
                  </button>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Code'}
                  </button>
                </div>
                
                {result && (
                  <div className="result-panel" style={{ 
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '0.25rem'
                  }}>
                    <h3>Result:</h3>
                    <pre style={{ 
                      margin: '0.5rem 0',
                      padding: '0.5rem',
                      backgroundColor: '#2d2d2d',
                      color: '#ffffff',
                      borderRadius: '0.25rem',
                      overflow: 'auto'
                    }}>
                      {typeof result.result === 'string' ? result.result : JSON.stringify(result.result, null, 2)}
                    </pre>
                    
                    <div style={{ 
                      marginTop: '0.5rem', 
                      color: result.status === 'success' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      Status: <strong>{result.status}</strong>
                    </div>
                  </div>
                )}
              </div>
              
              {showHistory && (
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div className="submission-history" style={{ 
                    border: '1px solid var(--gray-300)',
                    borderRadius: '0.25rem',
                    height: '400px',
                    overflow: 'auto'
                  }}>
                    <div style={{ padding: '1rem' }}>
                      <h3>Submission History</h3>
                      {submissions.length === 0 ? (
                        <p style={{ color: 'var(--gray-500)' }}>No submissions yet</p>
                      ) : (
                        <div>
                          {submissions.map(submission => (
                            <div 
                              key={submission.id}
                              style={{ 
                                padding: '0.75rem', 
                                borderBottom: '1px solid var(--gray-200)',
                                cursor: 'pointer'
                              }}
                              onClick={() => loadSubmission(submission)}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ 
                                  color: submission.status === 'success' ? 'var(--success)' : 
                                         submission.status === 'failed' ? 'var(--danger)' : 'var(--warning)'
                                }}>
                                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                </span>
                                <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                                  {formatDate(submission.submitted_at)}
                                </span>
                              </div>
                              <div style={{ 
                                marginTop: '0.5rem',
                                fontSize: '0.875rem',
                                color: 'var(--gray-600)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                <code>{submission.code.substring(0, 50)}{submission.code.length > 50 ? '...' : ''}</code>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      {resource.type === 'video' && (
        <div className="card" style={{ marginTop: '1rem', padding: '0' }}>
          <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: '0', overflow: 'hidden' }}>
            <iframe 
              src={resource.url} 
              style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', border: '0' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              title={resource.title}
            ></iframe>
          </div>
          
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => studentApi.updateResourceProgress(Number(id), 'in_progress')}
              >
                Mark as In Progress
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={() => studentApi.updateResourceProgress(Number(id), 'completed')}
              >
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}
      
      {['ebook', 'slide'].includes(resource.type) && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Open the resource in a new window to view the content.</p>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Open {resource.type === 'ebook' ? 'eBook' : 'Slides'}
            </a>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => studentApi.updateResourceProgress(Number(id), 'in_progress')}
            >
              Mark as In Progress
            </button>
            
            <button 
              className="btn btn-primary"
              onClick={() => studentApi.updateResourceProgress(Number(id), 'completed')}
            >
              Mark as Completed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetail;