import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const createAuthenticatedRequest = () => {
  const token = localStorage.getItem('token');
  
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
      'x-user-role': 'marketing'
    }
  });
};

// Generate campaign ideas using OpenAI API
export const generateCampaignIdeas = async (prompt) => {
  const api = createAuthenticatedRequest();
  const response = await api.post('/marketing/ai/campaign-ideas', { prompt });
  return response.data;
};

// Generate campaign content suggestions using OpenAI API
export const generateContentSuggestions = async (campaignData) => {
  const api = createAuthenticatedRequest();
  const response = await api.post('/marketing/ai/content-suggestions', campaignData);
  return response.data;
};

// Analyze target audience using OpenAI API
export const analyzeTargetAudience = async (audienceData) => {
  const api = createAuthenticatedRequest();
  const response = await api.post('/marketing/ai/analyze-audience', audienceData);
  return response.data;
};

// Optimize campaign using AI
export const optimizeCampaign = async (campaignId) => {
  const api = createAuthenticatedRequest();
  const response = await api.post(`/marketing/ai/optimize-campaign/${campaignId}`);
  return response.data;
};

const aiService = {
  generateCampaignIdeas,
  generateContentSuggestions,
  analyzeTargetAudience,
  optimizeCampaign
};

export default aiService;
