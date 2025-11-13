import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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

  @Post('')
  @UseInterceptors(
    FileInterceptor('thumbnail', { fileFilter: imageFileFilter }),
  )
  async createNews(
    @Body() body: CreateNewsDto,
    @UploadedFile() thumbnailFile?: Express.Multer.File,
  ) {
    return await this.appService.createNews(body, thumbnailFile);
  }

  @Put('delete')
  async deleteNews(@Body('id') id: string) {
    return await this.appService.deleteNews(id);
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('thumbnail', { fileFilter: imageFileFilter }),
  )
  async updateNews(
    @Param('id') id: string,
    @Body() body: UpdateNewsDto,
    @UploadedFile() thumbnailFile?: Express.Multer.File,
  ) {
    return await this.appService.updateNews(id, body, thumbnailFile);
  }

  @Get('get-lastest')
  async getLatestNews(@Query() pagination: PaginationDto) {
    return await this.appService.getLatestNews(pagination);
  }

  @Get('news-admin')
  async getNewsBySearch(@Query() query: SearchNewsDto) {
    return await this.appService.getNewsBySearch(query);
  }

  @Get('news-filter-admin')
  async getNewsByFilter(@Query() query: FilterNewsDto) {
    return await this.appService.getNewsByFilter(query);
  }

  @Get('count-news')
  async countNews() {
    return await this.appService.countNews();
  }

  @Get('/:id')
  async getNewsById(@Param('id') id: string) {
    return await this.appService.getNewsById(id);
  }
}
