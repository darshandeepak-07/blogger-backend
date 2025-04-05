import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmailVerification,
  EmailVerificationSchema,
} from 'src/schemas/email-verification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailVerification.name, schema: EmailVerificationSchema },
    ]),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailRepository],
  exports: [EmailService, EmailRepository],
})
export class EmailModule {}
