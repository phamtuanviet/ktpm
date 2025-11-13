import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({})
export class RmqModule {
  static register(exchangeName: string): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: exchangeName,
            useFactory: () => ({
              transport: Transport.RMQ,
              options: {
                urls: [
                  process.env.RABBITMQ_URL ||
                    'amqp://guest:guest@localhost:5672',
                ],
                exchange: exchangeName,
                exchangeType: 'fanout',
              },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
