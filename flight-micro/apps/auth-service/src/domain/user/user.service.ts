import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { SearchUsersDto } from './dto/searchUsers.dto';
import { FilterUsersDto } from './dto/filterUsers.dto';
import { UpdateUserDto } from './dto/updateUsers.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  safeUser(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async getUserById(id: string) {
    const cached = await this.redisService.get(`user:${id}`);
    if (cached) return { user: cached };
    const user = await this.userRepository.findById(id);
    const lastestUser = this.safeUser(user);

    await this.redisService.set(
      `user:${id}`,
      JSON.stringify(lastestUser),
      3600,
    );

    return { user: lastestUser };
  }

  async searchUsers(query: SearchUsersDto) {
    const { users, totalPages, currentPage } =
      await this.userRepository.getUsersBySearch(
        query.page || 1,
        query.pageSize || 10,
        query.query || '',
        query.sortBy || 'id',
        query.sortOrder || 'asc',
      );
    const lastUsers = users.map((user) => this.safeUser(user));
    return { users: lastUsers, totalPages, currentPage };
  }

  async countUsers() {
    const cached = await this.redisService.get(`user:count`);
    if (cached) return { count: parseInt(cached, 10) };
    const count = await this.userRepository.countUsers();
    await this.redisService.set(`user:count`, count.toString(), 900);
    return { count };
  }

  async filterUsers(query: FilterUsersDto) {
    const { users, totalPages, currentPage } =
      await this.userRepository.filterUsers(query);
    const lastUsers = users.map((user) => this.safeUser(user));
    return { users: lastUsers, totalPages, currentPage };
  }

  async updateUser(body: UpdateUserDto, id: string) {
    const data = {
      ...body,
      id,
    };
    const user = await this.userRepository.updateUser(data);
    await this.redisService.set(
      `user:${id}`,
      JSON.stringify(this.safeUser(user)),
      3600,
    );
    return { user: this.safeUser(user) };
  }
}
