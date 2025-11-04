import { Injectable } from '@nestjs/common';
import { SERVICES } from 'src/config/services.config';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';

@Injectable()
export class UserService {
  constructor(private readonly proxyService: ProxyService) {}

  private readonly baseUrl = SERVICES.AUTH_SERVICE + '/api/user';

  async getUserById(req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + `/user/${req.params.id}`,
    );
  }

  async searchUsers(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/search');
  }

  async countUsers(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/count');
  }

  async filterUsers(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/filter-users');
  }

  async updateUser(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/update-user');
  }
}
