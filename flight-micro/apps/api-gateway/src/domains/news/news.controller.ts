import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewsService } from './news.service';
import { imageFileFilter } from 'src/common/filters/image.filter';
import type { Request, Response } from 'express';

@Controller('api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('create-news')
  @UseInterceptors(
    FileInterceptor('thumbnailFile', { fileFilter: imageFileFilter }),
  )
  async createNews(@Req() req: Request, @Res() res: Response) {
    const { news } = await this.newsService.createNews(req);
    return res.json({
      news,
      success: true,
      message: 'News created successfully.',
    });
  }

  @Post('update-news')
  @UseInterceptors(
    FileInterceptor('thumbnailFile', { fileFilter: imageFileFilter }),
  )
  async updateNews(@Req() req: Request, @Res() res: Response) {
    const { news } = await this.newsService.updateNews(req);
    return res.json({
      news,
      success: true,
      message: 'News updated successfully.',
    });
  }

  @Post('delete-news')
  async deleteNews(@Req() req: Request, @Res() res: Response) {
    const { news } = await this.newsService.deleteNews(req);
    return res.json({
      news,
      success: true,
      message: 'News deleted successfully.',
    });
  }

  @Get('count-news')
  async countNews(@Req() req: Request, @Res() res: Response) {
    const { count } = await this.newsService.countNews(req);
    return res.json({
      count,
      success: true,
    });
  }

  @Get('news/:id')
  async getNewsById(@Req() req: Request, @Res() res: Response) {
    const { news } = await this.newsService.getNewsById(req);
    return res.json({
      news,
      success: true,
    });
  }

  @Get('get-latest')
  async getLatestNews(@Req() req: Request, @Res() res: Response) {
    const { listNews } = await this.newsService.getLatestNews(req);
    return res.json({
      listNews,
      success: true,
    });
  }

  @Get('search')
  async getNewsBySearch(@Req() req: Request, @Res() res: Response) {
    const { listNews, totalPages, currentPage } =
      await this.newsService.getNewsBySearch(req);
    return res.json({
      listNews,
      success: true,
      totalPages,
      currentPage,
    });
  }

  @Get('filter')
  async getNewsByFilter(@Req() req: Request, @Res() res: Response) {
    const { listNews, totalPages, currentPage } =
      await this.newsService.getNewsByFilter(req);
    return res.json({
      listNews,
      success: true,
      totalPages,
      currentPage,
    });
  }
}
