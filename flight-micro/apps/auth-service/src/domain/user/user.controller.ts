import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { SearchUsersDto } from './dto/searchUsers.dto';
import { FilterUsersDto } from './dto/filterUsers.dto';
import { UpdateUserDto } from './dto/updateUsers.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Get('search')
  async searchUsers(@Query() query: SearchUsersDto) {
    return await this.userService.searchUsers(query);
  }

  @Get('count')
  async countUsers() {
    return await this.userService.countUsers();
  }

  @Get('filter-users')
  async filterUsers(@Query() query: FilterUsersDto) {
    return await this.userService.filterUsers(query);
  }

  @Post('update-user')
  async updateUser(@Body() body: UpdateUserDto) {
    return await this.userService.updateUser(body);
  }
}
