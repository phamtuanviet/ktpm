// src/auth/auth-gateway.service.ts
import { HttpException, Injectable, Req } from '@nestjs/common';
import { SERVICES } from '../../config/services.config';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { LoggingService } from 'src/log/logging.service';

interface CustomRequest extends Request {
  userCurrent?: any;
}

@Injectable()
export class AuthService {
  private readonly baseUrl = SERVICES.AUTH_SERVICE + '/api/auth';

  constructor(
    private readonly proxyService: ProxyService,
    private readonly logginService: LoggingService,
  ) {}

  async register(@Req() req: Request) {
    try {
      const deviceInfo = req.headers['user-agent'];
      req.body = {
        ...req.body,
        deviceInfo,
      };

      const result = await this.proxyService.forward(
        req,
        this.baseUrl + '/register',
      );
      this.logginService.log('User registered successfully', {
        body: result.user,
      });
      return result;
    } catch (error) {
      this.logginService.error('Error during user registration', {
        error,
        body: req.body,
      });
      error._logged = true;
      throw new HttpException(error.message, 500);
    }
  }

  async verifyEmail(@Req() req: Request) {
    const deviceInfo = req.headers['user-agent'];
    req.body = {
      ...req.body,
      deviceInfo,
    };
    return await this.proxyService.forward(req, this.baseUrl + '/verify-email');
  }

  async resendOtp(@Req() req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/resend-otp');
  }

  async login(@Req() req: Request) {
    try {
      const deviceInfo = req.headers['user-agent'];
      req.body = {
        ...req.body,
        deviceInfo,
      };
      const result = await this.proxyService.forward(
        req,
        this.baseUrl + '/login',
      );
      this.logginService.log('User logged in successfully', {
        body: req.body,
      });
      return result;
    } catch (error) {
      this.logginService.error('Error during user login', {
        error,
        body: req.body,
      });
      error._logged = true;
      throw new HttpException(error.message, 500);
    }
  }

  async logout(@Req() req: Request) {
    try {
      const result = await this.proxyService.forward(
        req,
        this.baseUrl + '/logout',
      );
      this.logginService.log('User logged out successfully', {
        body: req.body,
      });
      return result;
    } catch (error) {
      this.logginService.error('Error during user logout', {
        error,
        body: req.body,
      });
      throw new HttpException(error.message, 500);
    }
  }

  async requestResetPassword(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + '/request-reset-password',
    );
  }

  async verifyResetPassword(@Req() req: Request) {
    const deviceInfo = req.headers['user-agent'];
    req.body = {
      ...req.body,
      deviceInfo,
    };
    return await this.proxyService.forward(
      req,
      this.baseUrl + '/verify-reset-password',
    );
  }

  async resetPassword(@Req() req: Request) {
    const deviceInfo = req.headers['user-agent'];
    req.body = {
      ...req.body,
      deviceInfo,
    };
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
    const deviceInfo = req.headers['user-agent'];
    req.body = {
      ...req.body,
      deviceInfo,
    };
    return await this.proxyService.forward(
      req,
      this.baseUrl + '/refresh-access-token',
    );
  }

  authenticateWithGoogle(@Req() req: CustomRequest) {
    try {
      if (req.userCurrent && req.body.user.id === req.userCurrent.id) {
        this.logginService.log('User authenticated with Google successfully', {
          body: req.body.user,
        });
        return { user: req.body.user };
      }
      return new HttpException('Unauthorized', 401);
    } catch (error) {
      error._logged = true;
      throw new HttpException(error.message, 500);
    }
  }
}
