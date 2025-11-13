import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewsService } from './news.service';
import { imageFileFilter } from 'src/common/filters/image.filter';
import type { Request, Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  @UseInterceptors(
    FileInterceptor('thumbnail', { fileFilter: imageFileFilter }),
  )
  async createNews(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() thumbnailFile?: Express.Multer.File,
  ) {
    const { news } = await this.newsService.createNews(req);
    return res.json({
      news,
      success: true,
      message: 'News created successfully.',
    });
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('delete')
  async deleteNews(@Req() req: Request, @Res() res: Response) {
    const { news } = await this.newsService.deleteNews(req);
    return res.json({
      news,
      success: true,
      message: 'News deleted successfully.',
    });
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('thumbnail', { fileFilter: imageFileFilter }),
  )
  async updateNews(@Req() req: Request, @Res() res: Response) {
    const { news } = await this.newsService.updateNews(req);
    return res.json({
      news,
      success: true,
      message: 'News updated successfully.',
    });
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('count-news')
  async countNews(@Req() req: Request, @Res() res: Response) {
    const { count } = await this.newsService.countNews(req);
    return res.json({
      count,
      success: true,
    });
  }

  @Get('get-lastest')
  async getLatestNews(@Req() req: Request, @Res() res: Response) {
    const { listNews } = await this.newsService.getLatestNews(req);
    return res.json({
      data: listNews,
      success: true,
    });
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('news-admin')
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

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('news-filter-admin')
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

  @Get('/:id')
  async getNewsById(@Req() req: Request, @Res() res: Response) {
    const { news } = await this.newsService.getNewsById(req);
    return res.json({
      data: news,
      success: true,
    });
  }
}
