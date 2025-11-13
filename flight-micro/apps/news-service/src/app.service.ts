import { HttpException, Inject, Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { PrismaService } from './prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CreateNewsDto } from './dto/createNews.dto';
import { AppRepository } from './app.repository';
import { News } from 'generated/prisma';
import { UpdateNewsDto } from './dto/updateNews.dto';
import { FilterNewsDto } from './dto/filterNews.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject() private readonly redisService: RedisService,
    @Inject() private readonly prismaService: PrismaService,
    @Inject('logging-queue') private readonly loggingQueue: ClientProxy,
    @Inject() private readonly cloudinaryService: CloudinaryService,
    @Inject() private readonly appRepository: AppRepository,
  ) {}

  private toSafeNews(news: News) {
    return {
      id: news.id,
      title: news.title,
      thumbnailUrl: news.thumbnailUrl,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
      isPublished: news.isPublished,
      content: news.content,
    };
  }

  async createNews(body: CreateNewsDto, thumbnailFile?: Express.Multer.File) {
    let imageUrl: string | undefined = undefined;
    if (thumbnailFile) {
      const uploadedImage =
        await this.cloudinaryService.uploadFile(thumbnailFile);
      imageUrl = uploadedImage?.secure_url;
      if (!imageUrl) {
        throw new HttpException('Failed to upload image to Cloudinary', 500);
      }
    }

    const news = await this.appRepository.createNews(
      body.title,
      body.content,
      body.createdAt,
      body.isPublished,
      imageUrl,
    );
    this.loggingQueue.emit('news created', news);

    return { news };
  }

  async updateNews(
    id: string,
    body: UpdateNewsDto,
    thumbnailFile?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined = undefined;

    if (thumbnailFile) {
      const uploadedImage =
        await this.cloudinaryService.uploadFile(thumbnailFile);
      imageUrl = uploadedImage?.secure_url;
      if (!imageUrl) {
        throw new HttpException('Failed to upload image to Cloudinary', 500);
      }
    }
    const news = await this.appRepository.updateNews(
      id,
      body.title,
      body.content,
      imageUrl,
      body.isPublished,
    );
    this.loggingQueue.emit('news update', news);

    return { news };
  }

  async deleteNews(id: string) {
    const news = await this.appRepository.deleteNews(id);
    this.loggingQueue.emit('news deleted', news);
    return { news: this.toSafeNews(news) };
  }

  async countNews() {
    const count = await this.appRepository.countNews();
    return { count };
  }

  async getNewsById(id: string) {
    const news = await this.appRepository.findNewsById(id.toString());
    if (!news || news.isDeleted) {
      throw new HttpException('News not found', 404);
    }
    return { news };
  }

  async getLatestNews(pagination: { skip?: number; take?: number }) {
    const skipNum = pagination.skip || 0;
    const takeNum = pagination.take || 5;
    const newsList = await this.appRepository.getLatestNews(skipNum, takeNum);
    const safeNewsList = newsList.map((news) => this.toSafeNews(news));
    return { listNews: safeNewsList };
  }

  async getNewsBySearch(query: {
    page?: number;
    pageSize?: number;
    query?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const queryString = query.query ? query.query : '';
    const sortBy = query.sortBy ? query.sortBy : 'id';
    const sortOrder = query.sortOrder ? query.sortOrder : 'asc';
    const { news, totalPages, currentPage } =
      await this.appRepository.getNewsBySearch(
        page,
        pageSize,
        queryString,
        sortBy,
        sortOrder,
      );

    const safeNewsList = news.map((news) => this.toSafeNews(news));
    return {
      listNews: safeNewsList,
      totalPages,
      currentPage,
    };
  }

  async getNewsByFilter(query: FilterNewsDto) {
    const { listNews, totalPages, currentPage } =
      await this.appRepository.filterNews(query);
    return {
      listNews: listNews.map((news) => this.toSafeNews(news)),
      totalPages,
      currentPage,
    };
  }
}
