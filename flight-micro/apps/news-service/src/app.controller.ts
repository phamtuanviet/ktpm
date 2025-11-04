import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { CreateNewsDto } from './dto/createNews.dto';
import { imageFileFilter } from './filters/image.filter';
import { UpdateNewsDto } from './dto/updateNews.dto';
import { PaginationDto } from './dto/getLastestNews.dto';
import { SearchNewsDto } from './dto/searchNews.dto';
import { FilterNewsDto } from './dto/filterNews.dto';

@Controller('api/news')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-news')
  @UseInterceptors(
    FileInterceptor('thumbnailFile', { fileFilter: imageFileFilter }),
  )
  async createNews(
    @Body() body: CreateNewsDto,
    @UploadedFile() thumbnailFile?: Express.Multer.File,
  ) {
    return await this.appService.createNews(body, thumbnailFile);
  }

  @Post('update-news')
  @UseInterceptors(
    FileInterceptor('thumbnailFile', { fileFilter: imageFileFilter }),
  )
  async updateNews(
    @Body() body: UpdateNewsDto,
    @UploadedFile() thumbnailFile?: Express.Multer.File,
  ) {
    return await this.appService.updateNews(body, thumbnailFile);
  }

  @Post('delete-news')
  async deleteNews(@Body('id') id: string) {
    return await this.appService.deleteNews(id);
  }

  @Get('count-news')
  async countNews() {
    return await this.appService.countNews();
  }

  @Get('news/:id')
  async getNewsById(@Param('id') id: string) {
    return await this.appService.getNewsById(id);
  }

  @Get('get-latest')
  async getLatestNews(@Query() pagination: PaginationDto) {
    return await this.appService.getLatestNews(pagination);
  }

  @Get('search')
  async getNewsBySearch(@Query() query: SearchNewsDto) {
    return await this.appService.getNewsBySearch(query);
  }

  @Get('filter')
  async getNewsByFilter(@Query() query: FilterNewsDto) {
    return await this.appService.getNewsByFilter(query);
  }
}
