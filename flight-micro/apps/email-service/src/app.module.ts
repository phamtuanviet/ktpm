import { Module } from '@nestjs/common';
import { AppService } from './app.service';

import { MailerModule } from '@nestjs-modules/mailer';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AppSubService } from './app.sub';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: '"My App" <laiyenviet@gmail.com>',
      },
    }),
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'email-exchange',
          type: 'topic',
          options: {
            durable: true,
          },
        },
      ],
      uri: 'amqp://localhost:5672',
    }),
  ],
  providers: [AppService, AppSubService],
})
export class AppModule {}
