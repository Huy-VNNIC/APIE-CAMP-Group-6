# Marketing Role Documentation

## Overview
The marketing role in the Online Coding Platform is responsible for creating and managing marketing campaigns, developing promotional content, analyzing user engagement metrics, creating outreach strategies, and managing partnerships and collaborations.

## Login Credentials
- **Username:** marketing
- **Password:** marketing123

## Features and Capabilities

### 1. Marketing Campaigns
- Create, view, update, and delete marketing campaigns
- Define campaign parameters including title, description, start/end dates
- Target specific audience segments (students, instructors, or all)
- Track campaign status (draft, active, completed, cancelled)
- Select marketing channels (email, social, website, push notifications, SMS)
- Set and monitor campaign budgets
- Track campaign performance metrics

### 2. Promotional Content
- Create, view, update, and delete promotional content
- Manage various content types:
  - Banners
  - Email templates
  - Social media posts
  - Blog articles
  - Videos
  - Newsletters
- Associate content with specific campaigns
- Track content performance metrics (views, clicks, shares, conversions)

### 3. User Engagement Analytics
- View comprehensive engagement metrics
- Filter metrics by date range, user segment, and source
- Access summary reports of key performance indicators
- Track:
  - Active users
  - Page views
  - Session duration
  - Bounce rates
  - Course enrollments
  - Course completions
  - Quiz attempts
  - Feedback submissions
- Associate metrics with specific campaigns

### 4. Partnerships and Collaborations
- Create, view, update, and delete partnerships
- Manage different partner types (educational, corporate, nonprofit, etc.)
- Store partner contact information
- Define partnership goals and benefits
- Track partnership status and timeline
- Store partnership-related documents

## API Endpoints

### Marketing Campaigns
- `GET /api/marketing/campaigns` - Get all campaigns
- `GET /api/marketing/campaigns/:id` - Get a specific campaign
- `POST /api/marketing/campaigns` - Create a new campaign
- `PUT /api/marketing/campaigns/:id` - Update a campaign
- `DELETE /api/marketing/campaigns/:id` - Delete a campaign

### Promotional Content
- `GET /api/marketing/promotional-content` - Get all promotional content
- `GET /api/marketing/promotional-content/campaign/:campaignId` - Get promotional content by campaign
- `GET /api/marketing/promotional-content/:id` - Get specific promotional content
- `POST /api/marketing/promotional-content` - Create new promotional content
- `PUT /api/marketing/promotional-content/:id` - Update promotional content
- `DELETE /api/marketing/promotional-content/:id` - Delete promotional content

### Engagement Metrics
- `GET /api/marketing/metrics` - Get all metrics
- `GET /api/marketing/metrics/summary` - Get summarized metrics
- `GET /api/marketing/metrics/campaign/:campaignId` - Get metrics by campaign
- `GET /api/marketing/metrics/:id` - Get specific metrics record
- `POST /api/marketing/metrics` - Create new metrics record
- `PUT /api/marketing/metrics/:id` - Update metrics record
- `DELETE /api/marketing/metrics/:id` - Delete metrics record

### Partnerships
- `GET /api/marketing/partnerships` - Get all partnerships
- `GET /api/marketing/partnerships/:id` - Get a specific partnership
- `POST /api/marketing/partnerships` - Create a new partnership
- `PUT /api/marketing/partnerships/:id` - Update a partnership
- `DELETE /api/marketing/partnerships/:id` - Delete a partnership

## Setup Instructions

To set up the marketing user:

1. Ensure the backend server is running
2. Run the following command to create the marketing user:
   ```
   node backend/scripts/create-marketing-user.js
   ```
3. Login with the credentials provided above

## Data Models

### Marketing Campaign Model
```javascript
{
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  targetAudience: String (students/instructors/all),
  status: String (draft/active/completed/cancelled),
  channels: Array of Strings,
  budget: Number,
  createdBy: ObjectId (User reference),
  metrics: {
    impressions: Number,
    clicks: Number,
    conversions: Number,
    engagement: Number
  }
}
```

### Promotional Content Model
```javascript
{
  title: String,
  contentType: String (banner/email/social/blog/video/newsletter),
  description: String,
  content: String,
  imageUrl: String,
  linkUrl: String,
  status: String (draft/published/archived),
  campaign: ObjectId (Campaign reference),
  createdBy: ObjectId (User reference),
  metrics: {
    views: Number,
    clicks: Number,
    shares: Number,
    conversions: Number
  }
}
```

### Partnership Model
```javascript
{
  partnerName: String,
  partnerType: String (educational/corporate/nonprofit/technology/media),
  contactPerson: {
    name: String,
    email: String,
    phone: String
  },
  startDate: Date,
  endDate: Date,
  description: String,
  goals: Array of Strings,
  benefits: Array of Strings,
  status: String (proposed/active/completed/cancelled),
  documents: Array of { title: String, url: String },
  createdBy: ObjectId (User reference)
}
```

### Engagement Metrics Model
```javascript
{
  date: Date,
  userSegment: String (all/students/instructors/new/returning),
  metrics: {
    activeUsers: Number,
    pageViews: Number,
    averageSessionDuration: Number, // in seconds
    bounceRate: Number, // percentage
    courseEnrollments: Number,
    courseCompletions: Number,
    quizAttempts: Number,
    feedbackSubmissions: Number
  },
  source: String (website/app/email/social/search/direct/referral/campaign),
  campaign: ObjectId (Campaign reference),
  notes: String
}
```
