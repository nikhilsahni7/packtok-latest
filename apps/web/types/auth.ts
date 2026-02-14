export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone_number?: string;
  country?: string;
  profile_image?: string;
  permissions?: string[];
  [key: string]: unknown;
}
