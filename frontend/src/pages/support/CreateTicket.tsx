import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import studentApi from '../../api/student';
import DashboardLayout from '../../layouts/DashboardLayout';
import Alert from '../../components/common/Alert';

const CreateTicket: React.FC = () => {
  const { user, currentDate } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      setError('Please fill out all required fields');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // Giả định có API endpoint để tạo ticket
      const response = await studentApi.createTicket({
        subject,
        message,
        category
      });
      
      if (response.success) {
        // Chuyển hướng đến trang chi tiết ticket mới tạo
        navigate(`/support/tickets/${response.data.id}`);
      } else {
        setError(response.message || 'Failed to create ticket');
      }
    } catch (err: any) {
      console.error('Error creating ticket:', err);
      setError(err.message || 'An error occurred while creating your ticket');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center">
          <Link to="/support/tickets" className="mr-4 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create Support Ticket</h1>
        </div>
        <div className="text-sm text-gray-600 mt-1 dark:text-gray-400">
          <p>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDate}</p>
          <p>Current User's Login: {user?.login || 'Huy-VNNIC'}</p>
        </div>
      </div>
      
      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}
      
      <div className="bg-white shadow-sm rounded-lg p-6 dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="general">General Question</option>
              <option value="technical">Technical Issue</option>
              <option value="billing">Billing</option>
              <option value="account">Account</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Brief description of your issue"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message <span className="text-red-600">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Please provide details about your issue..."
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <Link
              to="/support/tickets"
              className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </Link>
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
                  Submitting...
                </>
              ) : (
                'Submit Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateTicket;