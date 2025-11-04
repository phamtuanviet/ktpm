import { Injectable } from '@nestjs/common';
import { SERVICES } from 'src/config/services.config';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';

@Injectable()
export class NewsService {
  private readonly baseUrl = SERVICES.NEWS_SERVICE + '/api/news';

  constructor(private readonly proxyService: ProxyService) {}

  async createNews(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/create-news');
  }

  async updateNews(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/update-news');
  }

  async deleteNews(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/delete-news');
  }

  async countNews(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/count-news');
  }

  async getNewsById(req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + `/news/${req.params.id}`,
    );
  }

  async getLatestNews(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/get-latest');
  }

  async getNewsBySearch(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/search');
  }

  async getNewsByFilter(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/filter');
  }
}
