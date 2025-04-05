import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EmailVerification extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  codeHash: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const EmailVerificationSchema =
  SchemaFactory.createForClass(EmailVerification);
