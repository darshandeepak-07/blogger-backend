import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/schemas/user.schema';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  bio?: string;
}
