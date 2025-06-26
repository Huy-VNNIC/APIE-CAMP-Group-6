import axios from 'axios';

// Use the proxy for API calls in development
const API_URL = '/api';

// Create simple axios instance without auth requirements
const createSimpleRequest = () => {
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
      console.log(`Making AI API request to: ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => {
      console.error('AI Request error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  instance.interceptors.response.use(
    (response) => {
      console.log(`AI API response from: ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      console.error('AI API error:', error);
      if (error.code === 'ECONNABORTED') {
        throw new Error('AI request timeout. Please try again.');
      }
      if (error.message === 'Network Error') {
        throw new Error('Cannot connect to AI service. Please check if the backend is running.');
      }
      throw error;
    }
  );

  return instance;
};

// Generate campaign ideas using OpenAI API
export const generateCampaignIdeas = async (prompt) => {
  try {
    const api = createSimpleRequest();
    const response = await api.post('/marketing/ai/campaign-ideas', { prompt });
    return response.data;
  } catch (error) {
    console.error('AI Campaign Ideas Error:', error);
    
    // Return fallback content for internet programs
    return {
      success: true,
      ideas: [
        {
          title: "Online Coding Bootcamp for Beginners",
          description: "A comprehensive 12-week program teaching web development fundamentals including HTML, CSS, JavaScript, and basic backend development. Perfect for career changers and students looking to enter the tech industry.",
          targetAudience: "students",
          audienceDescription: "Career changers, college students, and professionals looking to transition into technology roles",
          channels: ["email", "social", "website"]
        },
        {
          title: "Advanced JavaScript Masterclass",
          description: "Deep dive into modern JavaScript concepts including ES6+, async programming, frameworks like React and Node.js. Ideal for developers looking to enhance their skills.",
          targetAudience: "students", 
          audienceDescription: "Intermediate developers and programming students seeking advanced JavaScript knowledge",
          channels: ["email", "website", "social"]
        },
        {
          title: "Full-Stack Development Certification",
          description: "Complete program covering both frontend and backend development, databases, deployment, and project management. Industry-recognized certification upon completion.",
          targetAudience: "all",
          audienceDescription: "Students, professionals, and instructors interested in comprehensive web development skills",
          channels: ["email", "social", "website", "push"]
        }
      ],
      note: "Fallback content provided"
    };
  }
};

// Generate campaign content suggestions using OpenAI API
export const generateContentSuggestions = async (campaignData) => {
  const api = createSimpleRequest();
  const response = await api.post('/marketing/ai/content-suggestions', campaignData);
  return response.data;
};

// Analyze target audience using OpenAI API
export const analyzeTargetAudience = async (audienceData) => {
  const api = createSimpleRequest();
  const response = await api.post('/marketing/ai/analyze-audience', audienceData);
  return response.data;
};

// Optimize campaign using AI
export const optimizeCampaign = async (campaignId) => {
  const api = createSimpleRequest();
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
