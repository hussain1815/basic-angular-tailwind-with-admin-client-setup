export interface User {
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
  access_token: string;
  refresh_token: string;
  image?: string;
  show_room_name?: string;
}