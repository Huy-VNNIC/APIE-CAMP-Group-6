import axios from 'axios';
import { ApiResponse, DashboardResponse, ResourcesResponse } from '../types/student.types';

// Hàm trợ giúp để tạo mock data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const studentApi = {
  // Lấy dữ liệu dashboard
  getDashboard: async (): Promise<ApiResponse<DashboardResponse['data']>> => {
    try {
      // Trong thực tế, sẽ là API call như:
      // const response = await axios.get('/api/student/dashboard');
      // return response.data;
      
      // Mocking response
      await delay(800);
      
      return {
        success: true,
        data: {
          dashboardData: {
            progress: 65,
            level: 3,
            points: 750,
            completed_resources: 12
          },
          enrolledCourses: [
            {
              id: 1,
              title: 'JavaScript Fundamentals',
              description: 'Learn the basics of JavaScript programming',
              progress: 80,
              last_accessed: '2025-05-25 10:30:00'
            },
            {
              id: 2,
              title: 'React for Beginners',
              description: 'Introduction to React library and its concepts',
              progress: 45,
              last_accessed: '2025-05-26 14:15:00'
            },
            {
              id: 3,
              title: 'Advanced CSS & Sass',
              description: 'Master modern CSS techniques and Sass',
              progress: 30,
              last_accessed: '2025-05-24 09:20:00'
            }
          ],
          upcomingAssignments: [
            {
              id: 1,
              title: 'JavaScript Project',
              course_title: 'JavaScript Fundamentals',
              due_date: '2025-06-01 23:59:59'
            },
            {
              id: 2,
              title: 'React Component Challenge',
              course_title: 'React for Beginners',
              due_date: '2025-06-05 23:59:59'
            }
          ],
          recentActivities: [
            {
              id: 1,
              type: 'course_progress',
              description: 'Completed "Variables and Data Types" in JavaScript Fundamentals',
              timestamp: '2025-05-26 15:30:00'
            },
            {
              id: 2,
              type: 'assignment_submission',
              description: 'Submitted "CSS Layout Challenge" in Advanced CSS & Sass',
              timestamp: '2025-05-25 11:45:00'
            },
            {
              id: 3,
              type: 'course_progress',
              description: 'Started "React Hooks" in React for Beginners',
              timestamp: '2025-05-24 14:20:00'
            }
          ]
        },
        message: 'Dashboard data retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        success: false,
        message: 'Failed to fetch dashboard data'
      };
    }
  },
  
  // Lấy danh sách các học liệu
  getLearningResources: async (): Promise<ApiResponse<ResourcesResponse['data']>> => {
    try {
      // Trong thực tế, sẽ là API call như:
      // const response = await axios.get('/api/learning/resources');
      // return response.data;
      
      // Mocking response
      await delay(800);
      
      return {
        success: true,
        data: [
          {
            id: 1,
            title: 'Introduction to JavaScript',
            description: 'Learn the basics of JavaScript programming language. This course covers variables, data types, functions, and control structures.',
            type: 'video',
            created_at: '2025-05-20 14:30:00',
            tags: ['javascript', 'beginner', 'programming']
          },
          {
            id: 2,
            title: 'React Hooks Practice',
            description: 'Practice using React hooks with this coding exercise. You will implement useState, useEffect, and custom hooks.',
            type: 'code',
            created_at: '2025-05-22 10:45:00',
            tags: ['react', 'hooks', 'intermediate']
          },
          {
            id: 3,
            title: 'CSS Grid Layout Guide',
            description: 'A comprehensive guide to CSS Grid Layout. Learn how to create complex web layouts with CSS Grid.',
            type: 'document',
            created_at: '2025-05-18 09:15:00',
            tags: ['css', 'grid', 'layout']
          },
          {
            id: 4,
            title: 'JavaScript Array Methods',
            description: 'Master JavaScript array methods like map, filter, reduce, and more. Includes practical examples and exercises.',
            type: 'video',
            created_at: '2025-05-15 16:20:00',
            tags: ['javascript', 'arrays', 'methods']
          },
          {
            id: 5,
            title: 'Web Accessibility Quiz',
            description: 'Test your knowledge of web accessibility practices with this interactive quiz.',
            type: 'quiz',
            created_at: '2025-05-21 11:30:00',
            tags: ['accessibility', 'a11y', 'web standards']
          },
          {
            id: 6,
            title: 'Build a REST API with Node.js',
            description: 'Learn how to build a RESTful API using Node.js, Express, and MongoDB. Includes authentication and error handling.',
            type: 'code',
            created_at: '2025-05-19 13:45:00',
            tags: ['node.js', 'express', 'api', 'mongodb']
          },
        ],
        message: 'Resources retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching learning resources:', error);
      return {
        success: false,
        message: 'Failed to fetch learning resources'
      };
    }
  },
  
  // Lấy chi tiết một học liệu
  getResourceDetail: async (resourceId: number): Promise<ApiResponse<any>> => {
    try {
      // Trong thực tế, sẽ là API call như:
      // const response = await axios.get(`/api/learning/resources/${resourceId}`);
      // return response.data;
      
      // Mocking response
      await delay(600);
      
      // Mẫu dữ liệu cho một vài resource ID
      if (resourceId === 1) {
        return {
          success: true,
          data: {
            id: 1,
            title: "Introduction to JavaScript",
            description: "Learn the basics of JavaScript programming language",
            type: "video",
            content: "https://www.youtube.com/embed/PkZNo7MFNFg",
            created_at: "2025-05-20 14:30:00",
            updated_at: "2025-05-21 09:15:00",
            tags: ["javascript", "beginner", "programming"],
            author: "John Smith"
          },
          message: 'Resource retrieved successfully'
        };
      } else if (resourceId === 2) {
        return {
          success: true,
          data: {
            id: 2,
            title: "React Hooks Practice",
            description: "Practice using React hooks with this coding exercise",
            type: "code",
            content: `import React, { useState } from 'react';

function Counter() {
  // TODO: Implement a counter using useState
  // It should have increment and decrement functions
  
  return (
    <div>
      <h2>Counter: 0</h2>
      <button>Increment</button>
      <button>Decrement</button>
    </div>
  );
}

export default Counter;`,
            created_at: "2025-05-22 10:45:00",
            updated_at: "2025-05-22 10:45:00",
            tags: ["react", "hooks", "intermediate"],
            author: "Jane Doe"
          },
          message: 'Resource retrieved successfully'
        };
      }
      
      // Nếu không tìm thấy resource
      return {
        success: false,
        message: 'Resource not found'
      };
    } catch (error) {
      console.error('Error fetching resource details:', error);
      return {
        success: false,
        message: 'Failed to fetch resource details'
      };
    }
  },
  
  // API call khác có thể được thêm vào đây
};

export default studentApi;