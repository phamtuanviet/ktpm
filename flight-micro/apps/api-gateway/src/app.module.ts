import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { AuthModule } from './domains/auth/auth.module';
import { NewsModule } from './domains/news/news.module';
import { UserModule } from './domains/user/user.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore as any,
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
        ttl: 60,
      }),
    }),
    AuthModule,
    NewsModule,
    UserModule,
    TestModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
