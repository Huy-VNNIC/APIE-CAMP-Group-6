import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { formatDateUTC, timeAgo } from '../../utils/formatters';

interface Submission {
  id: number;
  submission_time: string;
  status: 'success' | 'failed' | 'pending' | 'graded';
  score?: number;
  feedback?: string;
  code?: string;
}

interface SubmissionHistoryProps {
  resourceId: number;
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ resourceId }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { currentDate, user } = useAuth();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // In a real app, this would be an API call
        // For demo, we'll simulate API call with mock data
        setTimeout(() => {
          const mockSubmissions: Submission[] = [
            {
              id: 1,
              submission_time: '2025-05-26 14:30:00',
              status: 'success',
              score: 95,
              feedback: 'Great job! Your solution is efficient and well-structured.',
              code: 'function example() {\n  console.log("Hello world!");\n  return true;\n}'
            },
            {
              id: 2,
              submission_time: '2025-05-25 10:15:00',
              status: 'failed',
              feedback: 'There seems to be an issue with your implementation. The function is not handling edge cases correctly.',
              code: 'function example() {\n  console.log("This has a bug");\n  return false;\n}'
            },
            {
              id: 3,
              submission_time: '2025-05-24 09:45:00',
              status: 'pending',
              code: 'function example() {\n  // Work in progress\n  return null;\n}'
            }
          ];
          
          setSubmissions(mockSubmissions);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submission history');
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [resourceId]);

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Success
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Failed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Pending
          </span>
        );
      case 'graded':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Graded
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
        <div className="p-4 mb-4 rounded-md border bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Submissions</h2>
        <div className="text-sm text-gray-500">
          <span className="mr-4">Current Date (UTC): {currentDate}</span>
          <span>Login: {user?.login || 'Huy-VNNIC'}</span>
        </div>
      </div>
      
      {submissions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't made any submissions yet.</p>
        </div>
      ) : (
        <div className="mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div>{submission.submission_time}</div>
                      <div className="text-xs text-gray-500">{timeAgo(submission.submission_time)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(submission.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {submission.score !== undefined ? `${submission.score}/100` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewSubmission(submission)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {selectedSubmission && (
        <div className="mt-6 border-t pt-6 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Submission Details</h3>
            <div className="text-sm text-gray-500">
              {selectedSubmission.submission_time}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="font-medium mb-2">Status</div>
            <div>{getStatusBadge(selectedSubmission.status)}</div>
          </div>
          
          {selectedSubmission.score !== undefined && (
            <div className="mb-4">
              <div className="font-medium mb-2">Score</div>
              <div className="text-lg font-semibold">{selectedSubmission.score}/100</div>
            </div>
          )}
          
          {selectedSubmission.feedback && (
            <div className="mb-4">
              <div className="font-medium mb-2">Feedback</div>
              <div className="p-3 bg-gray-50 rounded-md text-sm dark:bg-gray-700">
                {selectedSubmission.feedback}
              </div>
            </div>
          )}
          
          {selectedSubmission.code && (
            <div>
              <div className="font-medium mb-2">Your Code</div>
              <div className="p-3 bg-gray-50 rounded-md font-mono text-sm whitespace-pre-wrap dark:bg-gray-700">
                {selectedSubmission.code}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;