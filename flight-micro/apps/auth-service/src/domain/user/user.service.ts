import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { SearchUsersDto } from './dto/searchUsers.dto';
import { FilterUsersDto } from './dto/filterUsers.dto';
import { UpdateUserDto } from './dto/updateUsers.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    @Inject('logging-queue') private readonly loggingQueue: ClientProxy,
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    return { user };
  }

  async searchUsers(query: SearchUsersDto) {
    return await this.userRepository.getUsersBySearch(
      query.page || 1,
      query.pageSize || 10,
      query.query || '',
      query.sortBy || 'id',
      query.sortOrder || 'asc',
    );
  }

  async countUsers() {
    const count = await this.userRepository.countUsers();
    return { count };
  }

  async filterUsers(query: FilterUsersDto) {
    return await this.userRepository.filterUsers(query);
  }

  async updateUser(body: UpdateUserDto) {
    const user = await this.userRepository.updateUser(body);
    return { user };
  }
}
