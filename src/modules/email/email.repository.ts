import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/repository';
import { EmailVerification } from 'src/schemas/email-verification.schema';

@Injectable()
export class EmailRepository extends BaseRepository<EmailVerification> {
  constructor(
    @InjectModel(EmailVerification.name) model: Model<EmailVerification>,
  ) {
    super(model);
  }
}
