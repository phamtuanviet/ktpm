import { Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request, Response } from 'express';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user-admin')
  async searchUsers(@Req() req: Request, @Res() res: Response) {
    const data = await this.userService.searchUsers(req);
    return res.json({
      ...data,
      success: true,
    });
  }

  @Get('count')
  async countUsers(@Req() req: Request, @Res() res: Response) {
    const { count } = await this.userService.countUsers(req);
    return res.json({
      count,
      success: true,
    });
  }

  @Get('user-filter-admin')
  async filterUsers(@Req() req: Request, @Res() res: Response) {
    const data = await this.userService.filterUsers(req);
    return res.json({
      ...data,
      success: true,
    });
  }

  @Put('/:id')
  async updateUser(@Req() req: Request, @Res() res: Response) {
    const { user } = await this.userService.updateUser(req);
    return res.json({
      user,
      success: true,
      message: 'User updated successfully.',
    });
  }

  @Get('/:id')
  async getUserById(@Req() req: Request, @Res() res: Response) {
    const { user } = await this.userService.getUserById(req);
    
    return res.json({
      userData: user,
      success: true,
    });
  }
}
