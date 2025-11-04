import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(@Inject() private readonly prismaService: PrismaService) {}

  findByEmail(email: string) {
    return this.prismaService.authUser.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prismaService.authUser.findUnique({ where: { id } });
  }

  createUser(email: string, hashedPassword: string, name: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.authUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  }

  updatePassword(userId: string, hashedPassword: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.authUser.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  verifyUser(userId: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.authUser.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }

  updateProviderInfo(
    userId: string,
    provider: string,
    providerId: string,
    tx?: any,
  ) {
    const db = tx ?? this.prismaService;
    return db.authUser.update({
      where: { id: userId },
      data: { provider, providerId, isVerified: true },
    });
  }

  createUserWithProvider(
    email: string,
    name: string,
    provider: string,
    providerId: string,
    tx?: any,
  ) {
    const db = tx ?? this.prismaService;
    return db.authUser.create({
      data: {
        email,
        name,
        provider,
        providerId,
        isVerified: true,
      },
    });
  }
}
