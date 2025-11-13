// shared-rabbit.module.ts
import { Global, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'logging-exchange',
          type: 'topic',
          options: {
            durable: true,
          },
        },
      ],
      uri: 'amqp://localhost:5672',
    }),
  ],
  exports: [RabbitMQModule],
})
export class LoggingRBMQModule {}
