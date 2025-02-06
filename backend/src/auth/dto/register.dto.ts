import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/interfaces/user.interface';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
} 