import React, { useEffect, useState } from 'react';
import studentApi from '../../api/student';
import Loader from '../common/Loader';
import Alert from '../common/Alert';

interface SubmissionHistoryProps {
  resourceId: number;
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ resourceId }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Giả định có API endpoint cho lịch sử submissions
        const response = await studentApi.getSubmissionHistory(resourceId);
        
        if (response.success) {
          setSubmissions(response.data);
        } else {
          setError(response.message || 'Failed to load submission history');
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('An error occurred while loading your submission history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [resourceId]);
  
  if (loading) {
    return <Loader />;
  }
  
  if (error) {
    return <Alert type="error" message={error} />;
  }
  
  if (submissions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center dark:bg-gray-800">
        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No submissions yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          You haven't submitted any code for this resource yet.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
      <div className="px-4 py-5 sm:px-6 border-b dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Submission History
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Your previous code submissions for this resource.
        </p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {submissions.map((submission) => (
          <div key={submission.id} className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-start">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span>Submitted at: {submission.submitted_at}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                submission.status === 'success' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {submission.status === 'success' ? 'Success' : 'Failed'}
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Code:</h4>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto dark:bg-gray-900 dark:text-gray-300">
                {submission.code}
              </pre>
            </div>
            
            {submission.result && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Result:</h4>
                <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto dark:bg-gray-900 dark:text-gray-300">
                  {typeof submission.result === 'string' 
                    ? submission.result 
                    : JSON.stringify(JSON.parse(submission.result), null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionHistory;