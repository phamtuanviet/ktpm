import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    token: string,
    expiresAt: Date,
    deviceInfo?: string,
    tx?: any,
  ) {
    const tokenHash = await bcrypt.hash(token, 10);
    const db = tx ?? this.prisma;
    return db.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        deviceInfo,
      },
    });
  }

  async findValidToken(userId: string, token: string, deviceInfo?: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    for (const t of tokens) {
      const match = await bcrypt.compare(token, t.tokenHash);
      if (match) {
        
        if (t.deviceInfo === deviceInfo) {
          return t;
        } else {
          await this.prisma.refreshToken.update({
            where: { id: t.id },
            data: { revoked: true },
          });
          return null;
        }
      }
    }
    return null;
  }

  async revoke(tokenId: string) {
    return this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { revoked: true },
    });
  }


  async revokeAllForUser(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}
