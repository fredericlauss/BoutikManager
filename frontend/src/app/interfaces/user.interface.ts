export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client'
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
} 