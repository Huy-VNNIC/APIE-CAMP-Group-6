import axios from 'axios';
import { createAuthenticatedRequest } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Generate campaign ideas using OpenAI API
export const generateCampaignIdeas = async (prompt) => {
  try {
    const api = createAuthenticatedRequest();
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
