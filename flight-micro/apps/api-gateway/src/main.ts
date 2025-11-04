import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import cookieParser  from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/allException.filter';
dotenv.config();
console.log('cookieParser:', cookieParser);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
