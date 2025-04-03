import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  AUTHOR = 'author',
  READER = 'reader',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, default: () => new Types.ObjectId().toString() })
  uuid: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.READER })
  role: string;

  @Prop({ type: String, default: '' }) 
  avatar: string;

  @Prop({ type: String, default: '' })
  bio: string;

  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
