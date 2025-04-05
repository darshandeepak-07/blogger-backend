import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly config: ConfigService) {}

  async sendVerificationEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: Number(this.config.get('SMTP_PORT')),
      secure: false,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });

    const mailOptions = {
      from: this.config.get('FROM_EMAIL'),
      to: email,
      subject: 'Verify your email address',
      html: `
            <h2>Welcome to Our App 🎉</h2>
            <p>Please use the following code to verify your email address:</p>
            <h3>${code}</h3>
            <p>This code will expire in 10 minutes.</p>
          `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Verification email sent:', info.messageId);
    } catch (err) {
      console.error('Failed to send email:', err);
      throw new Error('Email sending failed');
    }
  }
}
