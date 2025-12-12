import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { FilterNewsDto } from './dto/filterNews.dto';

@Injectable()
export class AppRepository {
  constructor(@Inject() private readonly prismaService: PrismaService) {}

  createNews(
    title: string,
    content: string,
    createdAt?: Date,
    isPublished?: boolean,
    thumbnailUrl?: string,
    tx?: any,
  ) {
    const updatedAt = new Date();
    const db = tx ?? this.prismaService;
    return db.news.create({
      data: {
        title,
        content,
        thumbnailUrl,
        createdAt,
        isPublished,
        updatedAt,
      },
    });
  }

  findNewsById(id: string) {
    return this.prismaService.news.findUnique({
      where: { id, isDeleted: false },
    });
  }

  updateNews(
    id: string,
    title?: string,
    content?: string,
    thumbnailUrl?: string,
    isPublished?: boolean,
    tx?: any,
  ) {
    const updatedAt = new Date();

    const db = tx ?? this.prismaService;
    return db.news.update({
      where: { id, isDeleted: false },
      data: {
        title,
        content,
        thumbnailUrl,
        isPublished,
        updatedAt,
      },
    });
  }

  deleteNews(id: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.news.update({
      where: { id, isDeleted: false },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  countNews() {
    return this.prismaService.news.count({
      where: { isDeleted: false },
    });
  }

  getLatestNews(skip?: number, take?: number) {
    return this.prismaService.news.findMany({
      where: { isDeleted: false, isPublished: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async getNewsBySearch(
    page = 1,
    pageSize = 10,
    query = '',
    sortBy = 'id',
    sortOrder = 'asc',
  ) {
    const skip = (page - 1) * pageSize;

    const searchCondition: any = {
      isDeleted: false,
    };
    if (query) {
      searchCondition.OR = [
        { title: { startsWith: query, mode: 'insensitive' } },
        { id: { startsWith: query , mode: 'insensitive'} },
        { content: { startsWith: query , mode: 'insensitive'} },
      ];
    }

    const orderByOption = {
      [sortBy]: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc',
    };

    const [news, totalNews] = await this.prismaService.$transaction([
      this.prismaService.news.findMany({
        where: searchCondition,
        skip,
        take: pageSize,
        orderBy: orderByOption,
      }),
      this.prismaService.news.count({ where: searchCondition }),
    ]);

    return {
      news,
      totalPages: Math.ceil(totalNews / pageSize),
      currentPage: page,
    };
  }

  async filterNews(query: FilterNewsDto) {
    const { page, pageSize, sortBy, sortOrder, ...filters } = query;
    const pageNum = page && page > 0 ? page : 1;
    const pageSizeNum = pageSize && pageSize > 0 ? pageSize : 10;
    const sortByField = sortBy ? sortBy : 'createdAt';
    const sortOrderValue = sortOrder ? sortOrder : 'desc';
    const skip = (pageNum - 1) * pageSizeNum;

    const operatorMap = {
      id: (val: string) => ({ startsWith: val , mode: 'insensitive'}),
      title: (val: string) => ({ startsWith: val , mode: 'insensitive'}),
      isPublished: (val: string) => ({ equals: val === 'true' }),
    };

    const where = Object.entries(filters)
      .filter(([key, val]) => val && operatorMap[key])
      .reduce(
        (acc, [key, val]) => {
          acc[key] = operatorMap[key](val);
          return acc;
        },
        {} as Record<string, any>,
      );

    if (!Object.keys(where).length)
      throw new Error('At least one filter param is required');

    where.isDeleted = false;

    const [news, totalNews] = await this.prismaService.$transaction([
      this.prismaService.news.findMany({
        where,
        skip,
        take: pageSizeNum,
        orderBy: { [sortByField]: sortOrderValue },
      }),
      this.prismaService.news.count({ where }),
    ]);

    return {
      listNews: news,
      totalPages: Math.ceil(totalNews / pageSizeNum),
      currentPage: pageNum,
    };
  }
}
