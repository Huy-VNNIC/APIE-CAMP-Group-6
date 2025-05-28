import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import studentApi from '../../api/student';
import DashboardLayout from '../../layouts/DashboardLayout';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

interface TicketResponse {
  id: number;
  support_user_id: number;
  support_name: string;
  message: string;
  responded_at: string;
}

interface Ticket {
  id: number;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  responses: TicketResponse[];
}

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ticketId = parseInt(id || '0');
  const { user, currentDate } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  useEffect(() => {
    const fetchTicketDetail = async () => {
      if (!ticketId) {
        setError('Invalid ticket ID');
        setLoading(false);
        return;
      }
      
      try {
        // Giả định có API endpoint để lấy chi tiết ticket
        const response = await studentApi.getTicketDetail(ticketId);
        
        if (response.success) {
          setTicket(response.data);
        } else {
          setError(response.message || 'Failed to load ticket details');
        }
      } catch (err) {
        console.error('Error fetching ticket details:', err);
        setError('An error occurred while loading the ticket');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicketDetail();
  }, [ticketId]);
  
  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newResponse.trim()) {
      setSubmitError('Please enter a response');
      return;
    }
    
    setSubmitting(true);
    setSubmitError('');
    
    try {
      // Giả định có API endpoint để thêm phản hồi cho ticket
      const response = await studentApi.addTicketResponse(ticketId, newResponse);
      
      if (response.success) {
        // Thêm phản hồi mới vào danh sách
        setTicket(prevTicket => {
          if (!prevTicket) return null;
          
          return {
            ...prevTicket,
            responses: [
              ...prevTicket.responses,
              {
                id: response.data.id,
                support_user_id: user?.id || 0,
                support_name: user?.name || 'You',
                message: newResponse,
                responded_at: response.data.responded_at || new Date().toISOString()
              }
            ]
          };
        });
        
        // Xóa nội dung phản hồi
        setNewResponse('');
      } else {
        setSubmitError(response.message || 'Failed to submit response');
      }
    } catch (err: any) {
      console.error('Error submitting response:', err);
      setSubmitError(err.message || 'An error occurred while submitting your response');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Open
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        );
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
  
  if (error || !ticket) {
    return (
      <DashboardLayout>
        <div className="mb-4">
          <Link to="/support/tickets" className="text-primary-600 hover:text-primary-800 flex items-center dark:text-primary-400 dark:hover:text-primary-300">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tickets
          </Link>
        </div>
        <Alert type="error" message={error || 'Ticket not found'} />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="mb-4">
        <Link to="/support/tickets" className="text-primary-600 hover:text-primary-800 flex items-center dark:text-primary-400 dark:hover:text-primary-300">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tickets
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{ticket.subject}</h1>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Ticket #{ticket.id}</span>
              <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Created: {ticket.created_at}</span>
            </div>
            <div className="text-sm text-gray-600 mt-2 dark:text-gray-400">
              <p>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDate}</p>
              <p>Current User's Login: {user?.login || 'Huy-VNNIC'}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              {getStatusBadge(ticket.status)}
            </div>
            {ticket.status !== 'closed' && (
              <button
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Close Ticket
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Original Ticket */}
      <div className="bg-white rounded-lg shadow-sm mb-6 dark:bg-gray-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-primary-100 rounded-full p-2 dark:bg-primary-900/30">
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">You</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ticket.created_at}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="prose max-w-none dark:prose-invert">
            <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">{ticket.message}</p>
          </div>
        </div>
      </div>
      
      {/* Responses */}
      {ticket.responses && ticket.responses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Responses</h2>
          
          <div className="space-y-6">
            {ticket.responses.map(response => (
              <div key={response.id} className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className={`rounded-full p-2 ${
                      response.support_user_id === user?.id
                        ? 'bg-primary-100 dark:bg-primary-900/30'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      <svg className={`w-6 h-6 ${
                        response.support_user_id === user?.id
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {response.support_user_id === user?.id ? 'You' : response.support_name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{response.responded_at}</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">{response.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Reply Form */}
      {ticket.status !== 'closed' && (
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Response</h3>
          </div>
          <div className="p-6">
            {submitError && (
              <Alert type="error" message={submitError} onClose={() => setSubmitError('')} />
            )}
            
            <form onSubmit={handleSubmitResponse}>
              <div className="mb-4">
                <textarea
                  id="response"
                  name="response"
                  rows={4}
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Type your response here..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Response'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TicketDetail;