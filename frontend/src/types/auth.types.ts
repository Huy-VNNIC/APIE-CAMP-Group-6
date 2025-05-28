export interface User {
  id: number;
  name: string;
  email: string;
  login: string; // Thêm login field để hiển thị Huy-VNNIC
  role: string;
  verified: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
}