const axios = require('axios');
const { validationResult } = require('express-validator');

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Helper to make OpenAI API requests
const callOpenAI = async (messages) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response?.data || error.message);
    throw new Error('Failed to generate AI content');
  }
};

// Helper to generate fallback campaign ideas for internet/coding programs
const generateFallbackCampaignIdeas = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Internet programs related fallback ideas
  if (lowerPrompt.includes('internet') || lowerPrompt.includes('online') || lowerPrompt.includes('web') || lowerPrompt.includes('programming') || lowerPrompt.includes('coding')) {
    return [
      {
        title: "Learn Web Development - From Zero to Hero",
        description: "A comprehensive online program teaching HTML, CSS, JavaScript, React, and Node.js. Build real projects and get job-ready skills in 6 months.",
        targetAudience: "students",
        audienceDescription: "Beginners and career changers looking to enter web development",
        channels: ["email", "social", "website", "push"]
      },
      {
        title: "Advanced Internet Technologies Bootcamp",
        description: "Master modern web technologies including cloud computing, API development, microservices, and deployment strategies. Perfect for experienced developers.",
        targetAudience: "students", 
        audienceDescription: "Intermediate to advanced developers and IT professionals",
        channels: ["email", "website", "social"]
      },
      {
        title: "Internet Security & Ethical Hacking Course",
        description: "Learn cybersecurity fundamentals, ethical hacking techniques, and how to protect web applications. Industry certification included.",
        targetAudience: "all",
        audienceDescription: "IT professionals, students, and anyone interested in cybersecurity",
        channels: ["email", "social", "website", "push", "sms"]
      }
    ];
  }
  
  // General educational campaign ideas
  return [
    {
      title: "Transform Your Career with Technology Skills",
      description: "Join our comprehensive technology education program and learn in-demand skills that employers are looking for.",
      targetAudience: "students",
      audienceDescription: "Working professionals and students seeking career advancement",
      channels: ["email", "social", "website"]
    },
    {
      title: "Interactive Learning Experience",
      description: "Experience hands-on learning with our innovative platform featuring live coding sessions, peer collaboration, and expert mentorship.",
      targetAudience: "all",
      audienceDescription: "Learners of all levels who prefer interactive and engaging education",
      channels: ["email", "website", "push"]
    },
    {
      title: "Flexible Learning for Busy Professionals",
      description: "Study at your own pace with our flexible course structure designed for working professionals and busy schedules.",
      targetAudience: "students",
      audienceDescription: "Working professionals balancing education with career responsibilities",
      channels: ["email", "social", "website", "sms"]
    }
  ];
};

// Generate campaign ideas
exports.generateCampaignIdeas = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    let campaignIdeas;

    // Check if OpenAI API key is available
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('OpenAI API key not configured, using fallback content');
      campaignIdeas = generateFallbackCampaignIdeas(prompt);
    } else {
      try {
        const messages = [
          {
            role: 'system',
            content: 'You are a marketing expert specializing in educational technology. Generate 3 detailed campaign ideas based on the user prompt. Format your response as a JSON array with each object containing: title, description, targetAudience (value should be "students", "instructors", or "all"), audienceDescription (descriptive text), and channels (array with any of: "email", "social", "website", "push", "sms").'
          },
          {
            role: 'user',
            content: prompt
          }
        ];

        const openAIResponse = await callOpenAI(messages);
        
        // Parse JSON from response
        try {
          campaignIdeas = JSON.parse(openAIResponse);
        } catch (err) {
          console.error('Error parsing OpenAI response:', err);
          console.log('Raw response:', openAIResponse);
          throw new Error('Invalid AI response format');
        }
      } catch (aiError) {
        console.error('OpenAI API failed, using fallback:', aiError.message);
        campaignIdeas = generateFallbackCampaignIdeas(prompt);
      }
    }

    res.json({
      success: true,
      ideas: campaignIdeas
    });
  } catch (err) {
    console.error('Error generating campaign ideas:', err);
    
    // Last resort fallback
    const fallbackIdeas = generateFallbackCampaignIdeas(req.body.prompt || 'general education');
    
    res.json({
      success: true,
      ideas: fallbackIdeas,
      note: 'Fallback content provided due to service unavailability'
    });
  }
};

// Generate content suggestions for a campaign
exports.generateContentSuggestions = async (req, res) => {
  try {
    const campaignData = req.body;
    
    if (!campaignData.title || !campaignData.description) {
      return res.status(400).json({
        success: false,
        message: 'Campaign title and description are required'
      });
    }

    const messages = [
      {
        role: 'system',
        content: `You are a marketing content specialist for an educational technology platform. 
        Generate creative content ideas for different marketing channels based on the campaign details. 
        Format your response as a JSON object with a property 'channelContent' which is an array of objects. 
        Each object should contain: 
        - channelName (string), 
        - description (string),
        - contentIdeas (array of objects with title and content)`
      },
      {
        role: 'user',
        content: `Generate content ideas for the following campaign:
        Title: ${campaignData.title}
        Description: ${campaignData.description}
        Target Audience: ${campaignData.targetAudience}
        Channels: ${campaignData.channels ? campaignData.channels.join(', ') : 'all channels'}`
      }
    ];

    const openAIResponse = await callOpenAI(messages);
    
    // Parse JSON from response
    let contentSuggestions;
    try {
      contentSuggestions = JSON.parse(openAIResponse);
    } catch (err) {
      console.error('Error parsing OpenAI response:', err);
      console.log('Raw response:', openAIResponse);
      contentSuggestions = { channelContent: [] };
    }

    res.json({
      success: true,
      data: contentSuggestions
    });
  } catch (err) {
    console.error('Error generating content suggestions:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate content suggestions'
    });
  }
};

// Analyze target audience
exports.analyzeTargetAudience = async (req, res) => {
  try {
    const { targetAudience } = req.body;
    
    if (!targetAudience) {
      return res.status(400).json({
        success: false,
        message: 'Target audience is required'
      });
    }

    const messages = [
      {
        role: 'system',
        content: `You are a marketing analytics expert specializing in educational technology.
        Provide detailed insights about the specified target audience.
        Format your response as a JSON object with: 
        - title (string), 
        - summary (string), 
        - characteristics (array of strings),
        - messagingRecommendations (string)`
      },
      {
        role: 'user',
        content: `Analyze the following target audience in the context of an educational technology platform: ${targetAudience}`
      }
    ];

    const openAIResponse = await callOpenAI(messages);
    
    // Parse JSON from response
    let audienceInsights;
    try {
      audienceInsights = JSON.parse(openAIResponse);
    } catch (err) {
      console.error('Error parsing OpenAI response:', err);
      console.log('Raw response:', openAIResponse);
      audienceInsights = { 
        title: 'Audience Insights', 
        summary: 'Unable to generate insights',
        characteristics: [],
        messagingRecommendations: 'N/A'
      };
    }

    res.json({
      success: true,
      data: audienceInsights
    });
  } catch (err) {
    console.error('Error analyzing audience:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze target audience'
    });
  }
};

// Optimize existing campaign
exports.optimizeCampaign = async (req, res) => {
  const { id } = req.params;
  
  try {
    const MarketingCampaign = require('../models/marketingCampaign.model');
    const campaign = await MarketingCampaign.findById(id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    const messages = [
      {
        role: 'system',
        content: `You are an AI marketing optimization specialist. 
        Analyze the provided campaign and suggest ways to optimize it.
        Format your response as a JSON object with: 
        - title (string),
        - summary (string),
        - recommendations (array of objects with title and description),
        - optimizedFields (object with suggested optimizations for specific fields)`
      },
      {
        role: 'user',
        content: `Optimize this marketing campaign:
        Title: ${campaign.title}
        Description: ${campaign.description}
        Target Audience: ${campaign.targetAudience}
        Status: ${campaign.status}
        Channels: ${campaign.channels.join(', ')}
        Budget: $${campaign.budget}
        Start Date: ${campaign.startDate}
        End Date: ${campaign.endDate}`
      }
    ];

    const openAIResponse = await callOpenAI(messages);
    
    let optimizationData;
    try {
      optimizationData = JSON.parse(openAIResponse);
    } catch (err) {
      console.error('Error parsing OpenAI response:', err);
      optimizationData = { 
        title: 'Campaign Optimization', 
        summary: 'Unable to generate optimization recommendations',
        recommendations: [],
        optimizedFields: {}
      };
    }

    res.json({
      success: true,
      data: optimizationData
    });
  } catch (err) {
    console.error('Error optimizing campaign:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize campaign'
    });
  }
};
