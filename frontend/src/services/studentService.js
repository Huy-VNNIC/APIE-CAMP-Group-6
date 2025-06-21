import axios from 'axios';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Add authorization token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Student Dashboard and Analytics
export const getStudentDashboard = () => api.get('/students/dashboard');
export const getStudentAnalytics = (courseId = null) => 
  api.get('/students/analytics', { params: { courseId } });

// Learning Recommendations
export const getLearningRecommendations = () => api.get('/students/recommendations');

// Course Activity Tracking
export const trackCourseAccess = (courseId, lessonId = null) => 
  api.post('/students/track/course', { courseId, lessonId });
export const trackLessonTime = (courseId, lessonId, timeSpentSeconds) => 
  api.post('/students/track/lesson-time', { courseId, lessonId, timeSpentSeconds });
export const completeLessonProgress = (courseId, lessonId) => 
  api.post('/students/track/complete-lesson', { courseId, lessonId });

// Peer Collaboration
export const getCoursePeers = (courseId) => api.get(`/students/collaborators/${courseId}`);
export const requestCollaboration = (peerId, courseId, topic, description, scheduledTime) => 
  api.post('/students/collaboration', { peerId, courseId, topic, description, scheduledTime });
export const getCollaborationRequests = () => api.get('/students/collaboration/requests');
export const respondToCollaborationRequest = (requestId, response) => 
  api.put(`/students/collaboration/${requestId}/respond`, { response });

// Feedback
export const submitFeedback = (courseId, content, rating, type) => 
  api.post('/students/feedback', { courseId, content, rating, type });

// Notifications
export const getStudentNotifications = () => api.get('/students/notifications');
export const markNotificationAsRead = (notificationId) => 
  api.put(`/students/notifications/${notificationId}/read`);

// Code Execution
export const submitCode = (resourceId, courseId, codeText, language) => 
  api.post('/code/submit', { resourceId, courseId, codeText, language });

export default {
  getStudentDashboard,
  getStudentAnalytics,
  getLearningRecommendations,
  trackCourseAccess,
  trackLessonTime,
  completeLessonProgress,
  getCoursePeers,
  requestCollaboration,
  getCollaborationRequests,
  respondToCollaborationRequest,
  submitFeedback,
  getStudentNotifications,
  markNotificationAsRead,
  submitCode
};
