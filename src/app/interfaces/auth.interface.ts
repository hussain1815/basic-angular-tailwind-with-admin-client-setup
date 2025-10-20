import { User } from './user.interface';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string | null;
  address: string | null;
  cnic: string | null;
  is_active: boolean;
  date_joined: string;
  last_login: string;
  image?: string;
  show_room_name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}