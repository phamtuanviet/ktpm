import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('send-verification-email')
  async handleVerificationEmail(
    @Payload() data: { email: string; code: string },
  ) {
    await this.appService.sendVerificationEmail(data.email, data.code);
  }

  @EventPattern('send-verification-reset-password')
  async handleResetPasswordEmail(@Payload() data: { email: string; code: string }) {
    await this.appService.sendResetPasswordEmail(data.email, data.code);
  }

}
