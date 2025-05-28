export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  last_accessed: string;
}

export interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

export interface Assignment {
  id: number;
  title: string;
  course_title: string;
  due_date: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  created_at: string;
  tags: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface DashboardResponse {
  data: {
    dashboardData: {
      progress: number;
      level: number;
      points: number;
      completed_resources: number;
    };
    enrolledCourses: Course[];
    upcomingAssignments: Assignment[];
    recentActivities: Activity[];
  };
}

export interface ResourcesResponse {
  data: Resource[];
}