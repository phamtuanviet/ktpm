import { Injectable } from '@nestjs/common';
import { SERVICES } from 'src/config/services.config';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { LoggingService } from 'src/log/logging.service';

@Injectable()
export class NewsService {
  private readonly baseUrl = SERVICES.NEWS_SERVICE + '/api/news';

  constructor(
    private readonly proxyService: ProxyService,
    private readonly logginService: LoggingService,
  ) {}

  async createNews(req: Request) {
    try {
      const result = await this.proxyService.forward(req, this.baseUrl);
      this.logginService.log('News created successfully', {
        body: result.news,
      });
      return result;
    } catch (error) {
      this.logginService.error('Error creating news', {
        error,
        body: req.body,
      });
      error._logged = true;
      throw error;
    }
  }

  async updateNews(req: Request) {
    try {
      const result = await this.proxyService.forward(
        req,
        this.baseUrl + `/${req.params.id}`,
      );
      this.logginService.log('News updated successfully', {
        body: result.news,
      });
      return result;
    } catch (error) {
      this.logginService.error('Error updating news', {
        error,
        body: { ...req.body, id: req.params.id },
      });
      error._logged = true;
      throw error;
    }
  }

  async deleteNews(req: Request) {
    try {
      const result = await this.proxyService.forward(
        req,
        this.baseUrl + '/delete',
      );
      this.logginService.log('News deleted successfully', {
        body: result.news,
      });
      return result;
    } catch (error) {
      this.logginService.error('Error deleting news', {
        error,
        body: req.body,
      });
      error._logged = true;
      throw error;
    }
  }

  async countNews(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/count-news');
  }

  async getNewsById(req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + `/${req.params.id}`,
    );
  }

  async getLatestNews(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/get-lastest');
  }

  async getNewsBySearch(req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/news-admin');
  }

  async getNewsByFilter(req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + '/news-filter-admin',
    );
  }
}
