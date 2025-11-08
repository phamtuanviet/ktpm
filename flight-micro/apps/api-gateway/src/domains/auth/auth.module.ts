import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { GoogleStrategy } from 'src/strategies/google.strategy';
import { ProxyModule } from 'src/proxy/proxy.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    ProxyModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
