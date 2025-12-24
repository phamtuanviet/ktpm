import {
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SERVICES } from 'src/config/services.config';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

interface CustomRequest extends Request {
  userCurrent?: any;
}

const FONTEND_URL = 'http://localhost:3001';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly baseUrl = SERVICES.AUTH_SERVICE + '/api/auth';

  @Post('register')
  async register(@Req() req: Request, @Res() res: Response) {
    const { user } = await this.authService.register(req);
    return res.json({
      user,
      success: true,
      message: 'Registration successful. Please verify your email.',
    });
  }

  @Post('verify-email')
  async verifyEmail(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.verifyEmail(req);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Email verification successful.',
      user,
      accessToken,
    });
  }

  @Post('resend-otp')
  async resendOtp(@Req() req: Request) {
    const { user } = await this.authService.resendOtp(req);
    return { user, success: true, message: 'OTP resent successfully.' };
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(req);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken,
      user,
      success: true,
      message: 'Login successful.',
    });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const { message } = await this.authService.logout(req);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return res.json({
      success: true,
      message,
    });
  }

  @Post('request-reset-password')
  async requestResetPassword(@Req() req: Request, @Res() res: Response) {
    const { user } = await this.authService.requestResetPassword(req);
    return res.json({
      user,
      success: true,
      message: 'Password reset requested successfully.',
    });
  }

  @Post('verify-reset-password')
  async verifyResetPassword(@Req() req: Request, @Res() res: Response) {
    const { user, refreshToken, accessToken } =
      await this.authService.verifyResetPassword(req);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user,
      accessToken,
      success: true,
      message: 'OTP verified successfully.',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(@Req() req: Request, @Res() res: Response) {
    const { user, refreshToken, accessToken } =
      await this.authService.resetPassword(req);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user,
      accessToken,
      success: true,
      message: 'Password reset successfully.',
    });
  }

  @Get('oauth/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Tự động redirect đến Google OAuth
  }

  @Get('oauth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { refreshToken, accessToken, user } =
      await this.authService.googleLogin(req);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const redirectUrl = `${FONTEND_URL}/auth/login-google?accessToken=${encodeURIComponent(accessToken)}&user=${encodeURIComponent(
      JSON.stringify(user),
    )}`;
    return res.redirect(redirectUrl);
  }

  @Post('refresh-access-token')
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await this.authService.refreshAccessToken(req);

    return res.json({
      accessToken,
      success: true,
      message: 'Access token refreshed successfully.',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('google-login-authenticate')
  authenticateWithGoogle(@Req() req: CustomRequest, @Res() res: Response) {
    const result = this.authService.authenticateWithGoogle(req);

    if (result instanceof HttpException) {
      throw result;
    }
    return res.json({
      user: result.user,
      success: true,
      message: 'Login successful',
    });
  }
}
