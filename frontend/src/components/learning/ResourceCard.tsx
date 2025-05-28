import React from 'react';
import { Link } from 'react-router-dom';
import { LearningResource } from '../../types/student.types';
import {
  PlayCircleIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface ResourceCardProps {
  resource: LearningResource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const getResourceIcon = () => {
    switch (resource.type) {
      case 'video':
        return <PlayCircleIcon className="h-6 w-6" />;
      case 'code':
        return <CodeBracketIcon className="h-6 w-6" />;
      case 'ebook':
        return <DocumentTextIcon className="h-6 w-6" />;
      case 'slide':
        return <PresentationChartBarIcon className="h-6 w-6" />;
      default:
        return <DocumentTextIcon className="h-6 w-6" />;
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-400 text-black',
      typescript: 'bg-blue-500 text-white',
      python: 'bg-blue-600 text-white',
      java: 'bg-red-600 text-white',
      csharp: 'bg-green-600 text-white',
      cpp: 'bg-blue-700 text-white',
      ruby: 'bg-red-700 text-white',
      php: 'bg-indigo-600 text-white',
      go: 'bg-cyan-600 text-white',
      swift: 'bg-orange-500 text-white',
      default: 'bg-gray-600 text-white',
    };

    return colors[language] || colors.default;
  };

  // Generate placeholder description if none provided
  const description = resource.description || `Learn ${resource.language} with this ${resource.type === 'video' ? 'video tutorial' : resource.type === 'code' ? 'coding exercise' : resource.type === 'slide' ? 'slide presentation' : 'e-book'}.`;

  return (
    <Link
      to={`/learning/resources/${resource.id}`}
      className="group flex flex-col h-full overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {resource.thumbnail ? (
          <img
            src={resource.thumbnail}
            alt={resource.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <div className="p-6 rounded-full bg-white/20 dark:bg-black/20 text-gray-600 dark:text-gray-300">
              {getResourceIcon()}
            </div>
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
            <span className="mr-1">{getResourceIcon()}</span>
            <span>
              {resource.type === 'video' ? 'Video' : 
               resource.type === 'code' ? 'Exercise' : 
               resource.type === 'slide' ? 'Slides' : 'E-Book'}
            </span>
          </div>
        </div>
        
        {/* Language Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getLanguageColor(resource.language)}`}>
            {resource.language}
          </span>
        </div>
        
        {/* Completion Badge */}
        {resource.completed && (
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center rounded-full bg-success-500/90 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-white">
              <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
              Completed
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {resource.title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            {new Date(resource.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
            View Details
            <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResourceCard;