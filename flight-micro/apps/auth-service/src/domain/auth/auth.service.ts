import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { AuthUser } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenRepository } from './refreshToken.repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  private toSafeUser(user: AuthUser) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    };
  }

  createAccessToken(user: AuthUser) {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  createRefreshToken(user: AuthUser) {
    return this.jwtService.sign(
      { sub: user.id, role: user.role, email: user.email },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      },
    );
  }

  decodeRefreshToken(token: string): string {
    const payload = this.jwtService.verify(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    return payload.sub;
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser && existingUser?.isVerified === true) {
      throw new HttpException('User with this email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prismaService.$transaction(async (tx) => {
      if (existingUser && existingUser?.isVerified === false) {
        return await this.authRepository.updatePassword(
          existingUser.id,
          hashedPassword,
          tx,
        );
      } else {
        const user = await this.authRepository.createUser(
          email,
          hashedPassword,
          name,
          tx,
        );
        return user;
      }
    });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    await this.redisService.set(
      `email-verification-register:${newUser.id}`,
      verificationCode,
      15 * 60,
    );
    // this.emailClient.emit('send-verification-email', {
    //   email: newUser.email,
    //   code: verificationCode,
    // });
    await this.amqpConnection.publish(
      'email-exchange',
      'send-verification-email',
      {
        email: newUser.email,
        code: verificationCode,
      },
    );

    const safeUser = this.toSafeUser(newUser);

    return { user: safeUser };
  }

  async verifyEmail(userId: string, code: string, deviceInfo?: string) {
    const storedCode = await this.redisService.get(
      `email-verification-register:${userId}`,
    );
    if (storedCode != code) {
      throw new HttpException('Invalid or expired verification code', 400);
    }

    await this.redisService.del(`email-verification-register:${userId}`);

    const user = await this.authRepository.verifyUser(userId);

    const accessToken = this.createAccessToken(user);
    const refreshToken = this.createRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepo.create(
      user.id,
      refreshToken,
      expiresAt,
      deviceInfo,
    );

    const safeUser = this.toSafeUser(user);

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  async resendOtp(email: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user || user.isVerified) {
      throw new HttpException('User not found or already verified', 404);
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(
      `email-verification-register:${user.id}`,
      newOtp,
      15 * 60,
    );
    // this.emailClient.emit('send-verification-email', {
    //   email: user?.email,
    //   code: newOtp,
    // });
    await this.amqpConnection.publish(
      'email-exchange',
      'send-verification-email',
      {
        email: user?.email,
        code: newOtp,
      },
    );

    const safeUser = this.toSafeUser(user);

    return { user: safeUser };
  }

  async login(body: { email: string; password: string; deviceInfo: string }) {
    const { email, password, deviceInfo } = body;
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid email or password', 401);
    }
    const passwordValid = user.password
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!passwordValid) {
      throw new HttpException('Invalid email or password', 401);
    }
    if (!user.isVerified) {
      throw new HttpException('Email not verified', 403);
    }
    const accessToken = this.createAccessToken(user);
    const refreshToken = this.createRefreshToken(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.refreshTokenRepo.create(
      user.id,
      refreshToken,
      expiresAt,
      deviceInfo,
    );
    const safeUser = this.toSafeUser(user);

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  async logout(id: string, refreshToken?: string) {
    if (!refreshToken) {
      throw new HttpException('Refresh token is required', 400);
    }
    const storedToken = await this.refreshTokenRepo.findValidToken(
      id,
      refreshToken,
    );
    if (storedToken) {
      await this.refreshTokenRepo.revoke(storedToken.id);
    }
    return { message: 'Logout successful' };
  }

  async requestResetPassword(email: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user || !user.isVerified) {
      throw new HttpException('User not found or not verified', 404);
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(
      `verify-reset-password:${user.id}`,
      newOtp,
      15 * 60,
    );
    // this.emailClient.emit('send-verification-reset-password', {
    //   email: user?.email,
    //   code: newOtp,
    // });

    await this.amqpConnection.publish(
      'email-exchange',
      'send-verification-reset-password',
      {
        email: user?.email,
        code: newOtp,
      },
    );

    const safeUser = this.toSafeUser(user);
    return { user: safeUser };
  }

  async verifyResetPassword(userId: string, code: string, deviceInfo?: string) {
    const storedCode = await this.redisService.get(
      `verify-reset-password:${userId}`,
    );
    if (!storedCode || storedCode != code) {
      throw new HttpException('Invalid or expired OTP', 400);
    }
    await this.redisService.del(`verify-reset-password:${userId}`);

    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const accessToken = this.createAccessToken(user);
    const refreshToken = this.createRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepo.create(
      user.id,
      refreshToken,
      expiresAt,
      deviceInfo,
    );

    const safeUser = this.toSafeUser(user);

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  async resetPassword(userId: string, newPassword: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.authRepository.updatePassword(userId, hashedPassword);

    const safeUser = this.toSafeUser(user);

    return { user: safeUser };
  }

  async googleLogin(
    body: {
      email: string;
      provider: string;
      providerId: string;
      name: string;
    },
    deviceInfo: string,
  ) {
    const { email, provider, providerId, name } = body;

    const existingUser = await this.authRepository.findByEmail(email);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (
      existingUser &&
      existingUser?.isVerified === true &&
      existingUser.provider === provider &&
      existingUser.providerId === providerId
    ) {
      const accessToken = this.createAccessToken(existingUser);
      const refreshToken = this.createRefreshToken(existingUser);

      await this.refreshTokenRepo.create(
        existingUser.id,
        refreshToken,
        expiresAt,
        deviceInfo,
      );

      return {
        accessToken,
        user: this.toSafeUser(existingUser),
        refreshToken,
      };
    } else if (
      existingUser &&
      existingUser.provider === null &&
      existingUser.providerId === null
    ) {
      await this.authRepository.updateProviderInfo(
        existingUser.id,
        provider,
        providerId,
      );

      const accessToken = this.createAccessToken(existingUser);
      const refreshToken = this.createRefreshToken(existingUser);
      await this.refreshTokenRepo.create(
        existingUser.id,
        refreshToken,
        expiresAt,
        deviceInfo,
      );
      return {
        user: this.toSafeUser(existingUser),
        accessToken,
        refreshToken,
      };
    } else {
      const newUser = await this.authRepository.createUserWithProvider(
        email,
        name,
        provider,
        providerId,
      );
      const refreshToken = this.createRefreshToken(newUser);

      await this.refreshTokenRepo.create(
        newUser.id,
        refreshToken,
        expiresAt,
        deviceInfo,
      );
      return {
        user: this.toSafeUser(newUser),
        accessToken: this.createAccessToken(newUser),
        refreshToken,
      };
    }
  }

  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException('Refresh token is required', 400);
    }
    const userId = this.decodeRefreshToken(refreshToken);
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const storedToken = await this.refreshTokenRepo.findValidToken(
      userId,
      refreshToken,
    );
    if (!storedToken) {
      throw new HttpException('Invalid or expired refresh token', 401);
    }
    const newAccessToken = this.createAccessToken(user);

    return {
      accessToken: newAccessToken,
    };
  }

  async authenticateWithGoogle(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException('Refresh token is required', 400);
    }
    const userId = this.decodeRefreshToken(refreshToken);
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const storedToken = await this.refreshTokenRepo.findValidToken(
      userId,
      refreshToken,
    );
    if (!storedToken) {
      throw new HttpException('Invalid or expired refresh token', 401);
    }
    const newAccessToken = this.createAccessToken(user);

    return {
      accessToken: newAccessToken,
      user: this.toSafeUser(user),
    };
  }
}
