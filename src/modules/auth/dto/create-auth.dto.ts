import { IsNotEmpty, IsEmail, MinLength, IsEnum } from "class-validator";
import { UserRole } from "src/schemas/user.schema";

export class CreateAuthDto {
    @IsNotEmpty()
    username: string;
  
    @IsEmail()
    email: string;
  
    @MinLength(6)
    password: string;
  
    @IsEnum(UserRole)
    role?: UserRole;
}
