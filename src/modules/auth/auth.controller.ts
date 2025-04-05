import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('verify')
  verifyEmail(
    @Body() data: { email: string; code: string; signUpData: SignUpDto },
  ) {
    return this.authService.verifyEmailAndCreateUser(
      data.email,
      data.code,
      data.signUpData,
    );
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protected(@CurrentUser() user: { userId: string; role: string }) {
    return {
      message: '🎉 You are authenticated!',
      user: user.userId,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  getAdminData(@CurrentUser() user) {
    return {
      message: 'Welcome Admin',
      user,
    };
  }
}
