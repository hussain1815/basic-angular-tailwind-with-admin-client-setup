import { User, Clinic } from './user.interface';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  full_name: string | null;
  user_role: string;
  user_details: any | null;
  clinic: Clinic;
  profile_photo: string | null;
  is_active: boolean;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}