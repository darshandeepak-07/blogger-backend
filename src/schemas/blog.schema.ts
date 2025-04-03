import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum BlogCategory {
  TECHNOLOGY = 'Technology',
  LIFESTYLE = 'Lifestyle',
  BUSINESS = 'Business',
  EDUCATION = 'Education',
}

@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ type: String, default: () => new Types.ObjectId().toString() })
  uuid: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Boolean, default: true })
  published: boolean;

  @Prop({ type: String, enum: BlogCategory, default: BlogCategory.TECHNOLOGY })
  category: string;

  @Prop({ type: String, required: true })
  authorId: string;

  @Prop({ type: [String], default: [] }) 
  images: string[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
