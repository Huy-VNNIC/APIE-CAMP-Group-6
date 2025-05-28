import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import studentApi from '../../api/student';
import DashboardLayout from '../../layouts/DashboardLayout';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import { Resource } from '../../types/student.types';

const Resources: React.FC = () => {
  const { user, currentDate } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await studentApi.getLearningResources();
        
        if (response.success) {
          setResources(response.data);
        } else {
          setError('Failed to load resources');
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('An error occurred while loading the resources');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);
  
  // Rest of the component code...
  
  return (
    <DashboardLayout>
      {/* Component content */}
    </DashboardLayout>
  );
};

export default Resources;