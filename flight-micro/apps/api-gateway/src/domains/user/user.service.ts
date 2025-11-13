import { HttpServer, Injectable } from '@nestjs/common';
import { SERVICES } from 'src/config/services.config';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { LoggingService } from 'src/log/logging.service';

@Injectable()
export class UserService {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly httpService: HttpService,
    private readonly logginService: LoggingService,
  ) {}

  private readonly baseUrl = SERVICES.AUTH_SERVICE + '/api/user';
  private readonly bookingUrl = SERVICES.BOOKING_SERVICE + '/api/ticket';

  async getUserById(req: Request) {
    const { user } = await this.proxyService.forward(
      req,
      this.baseUrl + `/${req.params.id}`,
    );

    const email = user.email;
    const { tickets } = (
      await this.httpService.axiosRef.get(
        `${this.bookingUrl}/tickets-lookup-client`,
        {
          params: { query: email },
        },
      )
    ).data;
    const lastUser = {
      ...user,
      tickets,
    };

    return { user: lastUser };
  }

  async searchUsers(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/user-admin');
  }

  async countUsers(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/count');
  }

  async filterUsers(req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + '/user-filter-admin',
    );
  }

  async updateUser(req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + `/${req.params.id}`,
    );
  }
}
