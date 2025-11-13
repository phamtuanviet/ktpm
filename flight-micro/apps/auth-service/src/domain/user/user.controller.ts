import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { SearchUsersDto } from './dto/searchUsers.dto';
import { FilterUsersDto } from './dto/filterUsers.dto';
import { UpdateUserDto } from './dto/updateUsers.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user-admin')
  async searchUsers(@Query() query: SearchUsersDto) {
    return await this.userService.searchUsers(query);
  }

  @Get('count')
  async countUsers() {
    return await this.userService.countUsers();
  }

  @Get('user-filter-admin')
  async filterUsers(@Query() query: FilterUsersDto) {
    return await this.userService.filterUsers(query);
  }

  @Put('/:id')
  async updateUser(@Body() body: UpdateUserDto, @Param('id') id: string) {
    return await this.userService.updateUser(body, id);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }
}
