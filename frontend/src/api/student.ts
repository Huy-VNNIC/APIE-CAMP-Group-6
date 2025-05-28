import { ApiResponse, DashboardResponse, ResourcesResponse } from '../types/student.types';

// Hàm trợ giúp để tạo mock data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const studentApi = {
  // Lấy dữ liệu dashboard
  getDashboard: async (): Promise<ApiResponse<DashboardResponse['data']>> => {
    try {
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
      await delay(800);
      
      return {
        success: true,
        data: [
          {
            id: 1,
            title: 'Introduction to JavaScript',
            description: 'Learn the basics of JavaScript programming language.',
            type: 'video',
            created_at: '2025-05-20 14:30:00',
            tags: ['javascript', 'beginner', 'programming']
          },
          {
            id: 2,
            title: 'React Hooks Practice',
            description: 'Practice using React hooks with this coding exercise.',
            type: 'code',
            created_at: '2025-05-22 10:45:00',
            tags: ['react', 'hooks', 'intermediate']
          }
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
      await delay(600);
      
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
      }
      
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
  
  // Thêm hàm updatePreferences cho Profile.tsx
  updatePreferences: async (preferences: any): Promise<ApiResponse<any>> => {
    try {
      await delay(800);
      
      return {
        success: true,
        data: {
          message: 'Preferences updated successfully',
          preferences
        },
        message: 'Preferences updated successfully'
      };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return {
        success: false,
        message: 'Failed to update preferences'
      };
    }
  },

  // Thêm hàm getProfile cho Profile.tsx
  getProfile: async (): Promise<ApiResponse<any>> => {
    try {
      await delay(600);
      
      return {
        success: true,
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          login: 'Huy-VNNIC',
          bio: 'Frontend developer with a passion for learning',
          preferences: {
            emailNotifications: true,
            darkMode: false,
            language: 'en'
          },
          enrolledCourses: 3,
          completedCourses: 1,
          achievements: [
            {
              id: 1,
              name: 'Getting Started',
              description: 'Completed your first course',
              dateAwarded: '2025-04-15 10:30:00'
            },
            {
              id: 2,
              name: 'Code Master',
              description: 'Completed 10 coding challenges',
              dateAwarded: '2025-05-20 14:45:00'
            }
          ]
        },
        message: 'Profile retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        message: 'Failed to fetch profile'
      };
    }
  },
  
  // Thêm hàm updateProfile cho Profile.tsx
  updateProfile: async (profileData: any): Promise<ApiResponse<any>> => {
    try {
      await delay(800);
      
      return {
        success: true,
        data: {
          message: 'Profile updated successfully',
          profile: {
            ...profileData,
            id: 1,
            login: 'Huy-VNNIC'
          }
        },
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: 'Failed to update profile'
      };
    }
  }
};

export default studentApi;