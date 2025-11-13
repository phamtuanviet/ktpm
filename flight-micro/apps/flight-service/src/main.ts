import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
  //     queue: 'flight-branch',
  //     queueOptions: {
  //       durable: true,
  //     },

  //     exchange: 'flight-booking-exchange',
  //     exchangeType: 'fanout',
  //   },
  // });

  // await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 5003);
}
bootstrap();
