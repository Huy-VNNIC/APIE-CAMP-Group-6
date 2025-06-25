import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress
  // Tooltip - removed unused import
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Icons
import CodeIcon from '@mui/icons-material/Code';
import DateRangeIcon from '@mui/icons-material/DateRange';

const AssignmentCard = ({ assignment }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Calculate days remaining
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Format date to locale string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return new Date(`${year}-${month}-${day}`).toLocaleDateString('vi-VN', options);
    }
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  
  // Get status based on days remaining
  const getStatus = () => {
    const daysRemaining = calculateDaysRemaining(assignment.dueDate);
    
    if (daysRemaining < 0) {
      return { label: t('assignments.overdue'), color: 'error' };
    } else if (daysRemaining <= 2) {
      return { label: t('assignments.urgent'), color: 'error' };
    } else if (daysRemaining <= 7) {
      return { label: t('assignments.upcoming'), color: 'warning' };
    } else {
      return { label: t('assignments.open'), color: 'success' };
    }
  };
  
  const status = getStatus();
  
  const handleViewAssignment = () => {
    navigate(`/assignments/${assignment.id}`);
  };
  
  const handleStartAssignment = () => {
    navigate(`/playground?assignment=${assignment.id}`);
  };
  
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        {/* Assignment header with language icon and status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CodeIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="caption" color="text.secondary">
              {assignment.language}
            </Typography>
          </Box>
          <Chip 
            label={status.label}
            color={status.color}
            size="small"
          />
        </Box>
        
        {/* Title */}
        <Typography variant="h6" gutterBottom>
          {assignment.title}
        </Typography>
        
        {/* Description if available */}
        {assignment.description && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {assignment.description}
          </Typography>
        )}
        
        {/* Due date */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <DateRangeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {t('assignments.due_date')}: {formatDate(assignment.dueDate)}
          </Typography>
        </Box>
        
        {/* Progress bar if progress exists */}
        {assignment.progress !== undefined && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {t('assignments.progress')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {assignment.progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={assignment.progress} 
              color={assignment.progress >= 100 ? "success" : "primary"}
              sx={{ height: 6, borderRadius: 1 }}
            />
          </Box>
        )}
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          onClick={handleViewAssignment}
        >
          {t('assignments.view')}
        </Button>
        <Button 
          size="small"
          color="primary" 
          onClick={handleStartAssignment}
        >
          {assignment.progress > 0 ? t('assignments.continue') : t('assignments.start')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default AssignmentCard;
