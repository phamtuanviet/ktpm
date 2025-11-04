import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { FilterUsersDto } from './dto/filterUsers.dto';
import { UpdateUserDto } from './dto/updateUsers.dto';
type QueryMode = Prisma.QueryMode;
type UserWhereInput = Prisma.AuthUserWhereInput;

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: string) {
    return this.prismaService.authUser.findUnique({ where: { id } });
  }

  async getUsersBySearch(
    page: number,
    pageSize: number,
    query: string,
    sortBy: string,
    sortOrder = 'asc',
  ) {
    const skip = (page - 1) * pageSize;

    const searchCondition = query
      ? {
          OR: [
            { id: { equals: query } },
            { name: { contains: query, mode: 'insensitive' as QueryMode } },
            { email: { contains: query, mode: 'insensitive' as QueryMode } },
          ],
        }
      : {};

    const orderByOption = { [sortBy]: sortOrder };

    const users = await this.prismaService.authUser.findMany({
      where: searchCondition,
      skip,
      take: pageSize,
      orderBy: orderByOption,
    });

    const totalUsers = await this.prismaService.authUser.count({
      where: searchCondition,
    });

    return {
      users,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: page,
    };
  }

  countUsers() {
    return this.prismaService.authUser.count();
  }

  async filterUsers(query: FilterUsersDto) {
    const operatorMap: Record<string, 'equals' | 'contains'> = {
      id: 'equals',
      email: 'contains',
      role: 'equals',
      isVerified: 'equals',
      name: 'contains',
    };
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where: UserWhereInput = {};

    Object.entries(query).forEach(([key, val]) => {
      if (val == null || val === '' || !operatorMap[key]) return;

      const parsed: any = val;

      const operator = operatorMap[key];

      if (operator === 'contains') {
        where[key] = {
          contains: parsed,
          mode: 'insensitive' as Prisma.QueryMode,
        };
      } else {
        where[key] = {
          [operator]: parsed,
        };
      }
    });

    const [users, totalUsers] = await this.prismaService.$transaction([
      this.prismaService.authUser.findMany({
        where,
        skip,
        take: pageSize,
      }),
      this.prismaService.authUser.count({ where }),
    ]);

    return {
      users,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: page,
    };
  }

  updateUser(body: UpdateUserDto) {
    return this.prismaService.authUser.update({
      where: { id: body.id },
      data: {
        name: body.name,
        role: body.role,
        isVerified: body.isVerified,
      },
    });
  }
}
