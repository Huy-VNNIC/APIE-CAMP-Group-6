import React from 'react';

interface SearchFilterProps {
  selectedType: string;
  searchQuery: string;
  onTypeChange: (type: string) => void;
  onSearchChange: (query: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  selectedType,
  searchQuery,
  onTypeChange,
  onSearchChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTypeChange('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              selectedType === 'all'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onTypeChange('video')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              selectedType === 'video'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => onTypeChange('code')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              selectedType === 'code'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => onTypeChange('document')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              selectedType === 'document'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;