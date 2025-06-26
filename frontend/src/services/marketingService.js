import axios from 'axios';

// Use the proxy for API calls in development
const API_URL = '/api';

// Create simple axios instance without auth requirements
const createSimpleRequest = () => {
  console.log('Creating axios instance with base URL:', API_URL);
  
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000, // 30 second timeout
    withCredentials: false
  });

  // Add request interceptor for debugging
  instance.interceptors.request.use(
    (config) => {
      console.log('Making request:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        data: config.data
      });
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor for debugging
  instance.interceptors.response.use(
    (response) => {
      console.log('Response received:', {
        status: response.status,
        data: response.data,
        url: response.config.url
      });
      return response;
    },
    (error) => {
      console.error('Response interceptor error:', {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });
      return Promise.reject(error);
    }
  );

  // Add request interceptor for debugging
  instance.interceptors.request.use(
    (config) => {
      console.log(`Making API request to: ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  instance.interceptors.response.use(
    (response) => {
      console.log(`API response from: ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      console.error('API error:', error);
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.message === 'Network Error') {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  );

  return instance;
};

// Campaign API calls
export const getAllCampaigns = async () => {
  const api = createSimpleRequest();
  const response = await api.get('/marketing/campaigns');
  return response.data;
};

export const getCampaignById = async (id) => {
  const api = createSimpleRequest();
  const response = await api.get(`/marketing/campaigns/${id}`);
  return response.data;
};

export const createCampaign = async (campaignData) => {
  try {
    console.log('Creating campaign with data:', campaignData);
    console.log('API URL being used:', API_URL);
    
    const api = createSimpleRequest();
    console.log('Making POST request to:', `${API_URL}/marketing/campaigns`);
    
    const response = await api.post('/marketing/campaigns', campaignData);
    console.log('Campaign creation response:', response);
    
    return response.data;
  } catch (error) {
    console.error('Campaign creation error details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    // Improve error message
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint not found. Please check the backend configuration.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw error;
  }
};

export const updateCampaign = async (id, campaignData) => {
  const api = createSimpleRequest();
  const response = await api.put(`/marketing/campaigns/${id}`, campaignData);
  return response.data;
};

export const deleteCampaign = async (id) => {
  const api = createSimpleRequest();
  const response = await api.delete(`/marketing/campaigns/${id}`);
  return response.data;
};

// Promotional Content API calls
export const getAllPromotionalContent = async () => {
  const api = createSimpleRequest();
  const response = await api.get('/marketing/promotional-content');
  return response.data;
};

export const getPromotionalContentById = async (id) => {
  const api = createSimpleRequest();
  const response = await api.get(`/marketing/promotional-content/${id}`);
  return response.data;
};

export const getPromotionalContentByCampaign = async (campaignId) => {
  const api = createSimpleRequest();
  const response = await api.get(`/marketing/promotional-content/campaign/${campaignId}`);
  return response.data;
};

export const createPromotionalContent = async (contentData) => {
  const api = createSimpleRequest();
  const response = await api.post('/marketing/promotional-content', contentData);
  return response.data;
};

export const updatePromotionalContent = async (id, contentData) => {
  const api = createSimpleRequest();
  const response = await api.put(`/marketing/promotional-content/${id}`, contentData);
  return response.data;
};

export const deletePromotionalContent = async (id) => {
  const api = createSimpleRequest();
  const response = await api.delete(`/marketing/promotional-content/${id}`);
  return response.data;
};

// Partnership API calls
export const getAllPartnerships = async () => {
  const api = createSimpleRequest();
  const response = await api.get('/marketing/partnerships');
  return response.data;
};

export const getPartnershipById = async (id) => {
  const api = createSimpleRequest();
  const response = await api.get(`/marketing/partnerships/${id}`);
  return response.data;
};

export const createPartnership = async (partnershipData) => {
  const api = createSimpleRequest();
  const response = await api.post('/marketing/partnerships', partnershipData);
  return response.data;
};

export const updatePartnership = async (id, partnershipData) => {
  const api = createSimpleRequest();
  const response = await api.put(`/marketing/partnerships/${id}`, partnershipData);
  return response.data;
};

export const deletePartnership = async (id) => {
  const api = createSimpleRequest();
  const response = await api.delete(`/marketing/partnerships/${id}`);
  return response.data;
};

// Engagement Metrics API calls
export const getAllMetrics = async (queryParams = {}) => {
  const api = createSimpleRequest();
  const response = await api.get('/marketing/metrics', { params: queryParams });
  return response.data;
};

export const getMetricsSummary = async (queryParams = {}) => {
  const api = createSimpleRequest();
  const response = await api.get('/marketing/metrics/summary', { params: queryParams });
  return response.data;
};

export const getMetricsByCampaign = async (campaignId) => {
  const api = createSimpleRequest();
  const response = await api.get(`/marketing/metrics/campaign/${campaignId}`);
  return response.data;
};

export const getMetricById = async (id) => {
  const api = createSimpleRequest();
  const response = await api.get(`/marketing/metrics/${id}`);
  return response.data;
};

export const createMetric = async (metricData) => {
  const api = createSimpleRequest();
  const response = await api.post('/marketing/metrics', metricData);
  return response.data;
};

export const updateMetric = async (id, metricData) => {
  const api = createSimpleRequest();
  const response = await api.put(`/marketing/metrics/${id}`, metricData);
  return response.data;
};

export const deleteMetric = async (id) => {
  const api = createSimpleRequest();
  const response = await api.delete(`/marketing/metrics/${id}`);
  return response.data;
};

// Analytics specific function  
export const getEngagementMetrics = async (timeRange = '30days', campaignId = 'all') => {
  const api = createSimpleRequest();
  const params = new URLSearchParams();
  if (timeRange) params.append('timeRange', timeRange);
  if (campaignId && campaignId !== 'all') params.append('campaignId', campaignId);
  
  const response = await api.get(`/marketing/engagement-metrics?${params.toString()}`);
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
  deleteMetric,
  getEngagementMetrics
};

export default marketingService;
