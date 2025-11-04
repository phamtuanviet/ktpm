// src/auth/auth-gateway.service.ts
import { Injectable, Req } from '@nestjs/common';
import { SERVICES } from '../../config/services.config';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';

@Injectable()
export class AuthService {
  private readonly baseUrl = SERVICES.AUTH_SERVICE + '/api/auth';

  constructor(private readonly proxyService: ProxyService) {}

  async register(@Req() req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/register');
  }

  async verifyEmail(@Req() req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/verify-email');
  }

  async resendOtp(@Req() req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/resend-otp');
  }

  async login(@Req() req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/login');
  }

  async logout(@Req() req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/logout');
  }

  async requestResetPassword(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + '/request-reset-password',
    );
  }

  async verifyResetPassword(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + '/verify-reset-password',
    );
  }

  async resetPassword(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + '/reset-password',
    );
  }

  async googleLogin(@Req() req: Request) {
    req.method = 'post';
    req.body = {
      ...req.user,
    };
    return await this.proxyService.forward(req, this.baseUrl + '/google-login');
  }

  async refreshAccessToken(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + '/refresh-access-token',
    );
  }
}
