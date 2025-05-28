import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-500">404</h1>
        <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-6 dark:text-white">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto dark:text-gray-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;