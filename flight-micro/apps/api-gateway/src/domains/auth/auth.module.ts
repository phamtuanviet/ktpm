import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ProxyService } from 'src/proxy/proxy.service';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { GoogleStrategy } from 'src/strategies/google.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' })],
  controllers: [AuthController],
  providers: [AuthService, ProxyService, GoogleStrategy],
})
export class AuthModule {}
