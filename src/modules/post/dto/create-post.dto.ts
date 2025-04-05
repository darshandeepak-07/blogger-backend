import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsMongoId()
  @IsOptional()
  author: Types.ObjectId
}
