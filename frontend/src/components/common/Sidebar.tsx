import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  // Component code...
};

// Default export
export default Sidebar;