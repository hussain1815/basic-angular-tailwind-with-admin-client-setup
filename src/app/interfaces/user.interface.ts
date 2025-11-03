export interface Clinic {
  id: number;
  name: string;
  logo: string | null;
  address: string;
  phone: string;
  email: string;
  description: string;
  is_active: boolean;
  created: string;
  modified: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  user_role: string;
  user_details: any | null;
  clinic: Clinic;
  profile_photo: string | null;
  is_active: boolean;
  token: string;
  
  // Legacy fields for backward compatibility
  first_name?: string;
  last_name?: string;
  role?: string;
  phone_number?: string | null;
  address?: string | null;
  cnic?: string | null;
  date_joined?: string;
  last_login?: string;
  access_token?: string;
  refresh_token?: string;
  image?: string | null;
  show_room_name?: string;
}