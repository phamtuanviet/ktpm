// rmq-binding.module.ts

import { Module, OnModuleInit } from '@nestjs/common';
import amqp from 'amqplib';

const EXCHANGE_NAME = 'flight-booking-exchange';
const QUEUE_NAME = 'booking-branch';
const RMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

@Module({})
export class RmqBindingModule implements OnModuleInit {
  async onModuleInit() {
    try {
      const connection = await amqp.connect(RMQ_URL);
      const channel = await connection.createChannel();

      await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
      await channel.assertQueue(QUEUE_NAME, { durable: true });

      await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'seats.#');
      await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'seat.#');

      await channel.close();
      await connection.close();
    } catch (error) {
      console.error(
        '[RmqBinding ERROR] Không thể thiết lập Binding:',
        error.message,
      );
    }
  }
}
