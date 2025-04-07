import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { EmailRepository } from '../email/email.repository';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailRepository: EmailRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, username } = signUpDto;
    const userExists = await this.authRepository.findOne({
      $or: [{ email }, { username }],
    });
    if (userExists) throw new ConflictException('User already exists');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.emailRepository.create({ email, codeHash, expiresAt });
    await this.emailService.sendVerificationEmail(email, code);

    return { message: 'Verification email sent' };
  }

  async verifyEmailAndCreateUser(
    email: string,
    code: string,
    signUpDto: SignUpDto,
  ) {
    const record = await this.emailRepository.findOne({ email });
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Code expired or not found');
    }

    const isMatch = await bcrypt.compare(code, record.codeHash);
    if (!isMatch) throw new BadRequestException('Invalid verification code');

    await this.emailRepository.deleteOne({ email });

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.authRepository.create({
      ...signUpDto,
      password: hashedPassword,
      emailVerified: true,
    });
    return user;
  }

  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.authRepository.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: (user._id as Types.ObjectId).toString(),
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.authRepository.findOne({ _id: payload.sub });
      if (!user) throw new UnauthorizedException();

      const newAccessToken = this.jwtService.sign(
        { sub: (user._id as Types.ObjectId).toString(), role: user.role },
        { expiresIn: '15m' },
      );
      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
