// shared-rabbit.module.ts
import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'flight-booking-exchange',
          type: 'topic',
          options: {
            durable: true,
          },
        },
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
export class SharedRabbitModule {}
