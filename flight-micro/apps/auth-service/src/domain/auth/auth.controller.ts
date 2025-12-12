import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verifyEmail.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { GoogleLoginDto } from './dto/googleLogin.dto';
import type { Request } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyOtpDto) {
    const result = await this.authService.verifyEmail(
      body.id,
      body.otp,
      body.deviceInfo,
    );
    return result;
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: ResendOtpDto) {
    const result = await this.authService.resendOtp(body.email);
    return result;
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('logout')
  async logout(@Body() body: LogoutDto, @Req() req: Request) {
    if (!req.cookies['refreshToken']) {
      return { message: 'Logout successful' };
    }
    return await this.authService.logout(body.id, req.cookies['refreshToken']);
  }

  @Post('request-reset-password')
  async requestResetPassword(@Body() body: EmailDto) {
    return await this.authService.requestResetPassword(body.email);
  }

  @Post('verify-reset-password')
  async verifyResetPassword(@Body() body: VerifyOtpDto) {
    return await this.authService.verifyResetPassword(
      body.id,
      body.otp,
      body.deviceInfo,
    );
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.authService.resetPassword(body.id, body.newPassword);
  }

  @Post('google-login')
  async googleLogin(@Body() body: GoogleLoginDto, @Req() req: Request) {
    return await this.authService.googleLogin(
      body,
      req.headers['x-device-info'] as string,
    );
  }

  @Post('refresh-access-token')
  async refreshAccessToken(@Req() req: Request) {
    return await this.authService.refreshAccessToken(
      req.cookies['refreshToken'],
    );
  }

  @Get('google-login-authenticate')
  async authenticateWithGoogle(@Req() req: Request) {
    return await this.authService.authenticateWithGoogle(
      req.cookies['refreshToken'],
    );
  }
}
