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

// Campaign API calls
export const getAllCampaigns = async () => {
  const api = createAuthenticatedRequest();
  const response = await api.get('/marketing/campaigns');
  return response.data;
};

export const getCampaignById = async (id) => {
  const api = createAuthenticatedRequest();
  const response = await api.get(`/marketing/campaigns/${id}`);
  return response.data;
};

export const createCampaign = async (campaignData) => {
  const api = createAuthenticatedRequest();
  const response = await api.post('/marketing/campaigns', campaignData);
  return response.data;
};

export const updateCampaign = async (id, campaignData) => {
  const api = createAuthenticatedRequest();
  const response = await api.put(`/marketing/campaigns/${id}`, campaignData);
  return response.data;
};

export const deleteCampaign = async (id) => {
  const api = createAuthenticatedRequest();
  const response = await api.delete(`/marketing/campaigns/${id}`);
  return response.data;
};

// Promotional Content API calls
export const getAllPromotionalContent = async () => {
  const api = createAuthenticatedRequest();
  const response = await api.get('/marketing/promotional-content');
  return response.data;
};

export const getPromotionalContentById = async (id) => {
  const api = createAuthenticatedRequest();
  const response = await api.get(`/marketing/promotional-content/${id}`);
  return response.data;
};

export const getPromotionalContentByCampaign = async (campaignId) => {
  const api = createAuthenticatedRequest();
  const response = await api.get(`/marketing/promotional-content/campaign/${campaignId}`);
  return response.data;
};

export const createPromotionalContent = async (contentData) => {
  const api = createAuthenticatedRequest();
  const response = await api.post('/marketing/promotional-content', contentData);
  return response.data;
};

export const updatePromotionalContent = async (id, contentData) => {
  const api = createAuthenticatedRequest();
  const response = await api.put(`/marketing/promotional-content/${id}`, contentData);
  return response.data;
};

export const deletePromotionalContent = async (id) => {
  const api = createAuthenticatedRequest();
  const response = await api.delete(`/marketing/promotional-content/${id}`);
  return response.data;
};

// Partnership API calls
export const getAllPartnerships = async () => {
  const api = createAuthenticatedRequest();
  const response = await api.get('/marketing/partnerships');
  return response.data;
};

export const getPartnershipById = async (id) => {
  const api = createAuthenticatedRequest();
  const response = await api.get(`/marketing/partnerships/${id}`);
  return response.data;
};

export const createPartnership = async (partnershipData) => {
  const api = createAuthenticatedRequest();
  const response = await api.post('/marketing/partnerships', partnershipData);
  return response.data;
};

export const updatePartnership = async (id, partnershipData) => {
  const api = createAuthenticatedRequest();
  const response = await api.put(`/marketing/partnerships/${id}`, partnershipData);
  return response.data;
};

export const deletePartnership = async (id) => {
  const api = createAuthenticatedRequest();
  const response = await api.delete(`/marketing/partnerships/${id}`);
  return response.data;
};

// Engagement Metrics API calls
export const getAllMetrics = async (queryParams = {}) => {
  const api = createAuthenticatedRequest();
  const response = await api.get('/marketing/metrics', { params: queryParams });
  return response.data;
};

export const getMetricsSummary = async (queryParams = {}) => {
  const api = createAuthenticatedRequest();
  const response = await api.get('/marketing/metrics/summary', { params: queryParams });
  return response.data;
};

export const getMetricsByCampaign = async (campaignId) => {
  const api = createAuthenticatedRequest();
  const response = await api.get(`/marketing/metrics/campaign/${campaignId}`);
  return response.data;
};

export const getMetricById = async (id) => {
  const api = createAuthenticatedRequest();
  const response = await api.get(`/marketing/metrics/${id}`);
  return response.data;
};

export const createMetric = async (metricData) => {
  const api = createAuthenticatedRequest();
  const response = await api.post('/marketing/metrics', metricData);
  return response.data;
};

export const updateMetric = async (id, metricData) => {
  const api = createAuthenticatedRequest();
  const response = await api.put(`/marketing/metrics/${id}`, metricData);
  return response.data;
};

export const deleteMetric = async (id) => {
  const api = createAuthenticatedRequest();
  const response = await api.delete(`/marketing/metrics/${id}`);
  return response.data;
};

const marketingService = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getAllPromotionalContent,
  getPromotionalContentById,
  getPromotionalContentByCampaign,
  createPromotionalContent,
  updatePromotionalContent,
  deletePromotionalContent,
  getAllPartnerships,
  getPartnershipById,
  createPartnership,
  updatePartnership,
  deletePartnership,
  getAllMetrics,
  getMetricsSummary,
  getMetricsByCampaign,
  getMetricById,
  createMetric,
  updateMetric,
  deleteMetric
};

export default marketingService;
