import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tag extends Document {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  postCount: number;

  @Prop({ default: 0 })
  followerCount: number;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
