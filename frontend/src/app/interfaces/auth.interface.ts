import { UserRole } from "./user.interface";


export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
} 