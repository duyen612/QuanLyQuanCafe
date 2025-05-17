export enum UserRole {
  Admin = 'admin',
  Staff = 'staff',
}

export interface User {
  id?: number;
  username: string;
  password: string;
  email?: string;
  role?: UserRole; 
}