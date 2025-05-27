export interface DashboardData {
  progress: number;
  current_course?: string;
  completed_courses: string[];
  points: number;
  level: number;
  completed_resources: number;
  badges: string[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  instructor_id: number;
  instructor_name: string;
  progress: number;
  last_accessed: string;
  enrollment_date: string;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  course_id: number;
  course_title: string;
  total_points: number;
  status: 'pending' | 'submitted' | 'graded';
  submitted_at?: string;
  score?: number;
}

export interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

export interface DashboardResponse {
  success: boolean;
  mock?: boolean;
  data: {
    student: {
      id: number;
      name: string;
      email: string;
      login: string; // Thêm login field để hiển thị Huy-VNNIC
      verified: boolean;
      current_date: string; // Format: YYYY-MM-DD HH:MM:SS
    };
    dashboardData: DashboardData;
    enrolledCourses: Course[];
    upcomingAssignments: Assignment[];
    recentActivities: Activity[];
  };
}

export interface Profile {
  user_id: number;
  name: string;
  email: string;
  login: string; // Thêm login field để hiển thị Huy-VNNIC
  verified: boolean;
  created_at: string;
  profile_picture?: string;
  bio?: string;
  skills?: string[];
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark';
    editor_font_size?: number;
    editor_tab_size?: number;
    auto_save?: boolean;
    locale?: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
}

export interface ProfileUpdateRequest {
  name?: string;
  bio?: string;
  skills?: string[];
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  profile_picture?: string;
}

export interface CourseListResponse {
  success: boolean;
  data: {
    courses: Course[];
  };
}

export interface CourseDetailResponse {
  success: boolean;
  data: {
    course: any;
    enrollment: any;
    content: any[];
  };
}