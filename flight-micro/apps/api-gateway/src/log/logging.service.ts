import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

@Injectable()
export class LoggingService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  private sendLog(message: string, level: LogLevel, meta?: any) {
    const logPayload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta: meta || {},
    };

    this.amqpConnection.publish(
      'logging-exchange',
      `log.${level.toLowerCase()}`,
      logPayload,
    );
  }

  log(message: string, meta?: any) {
    this.sendLog(message, 'INFO', meta);
  }

  warn(message: string, meta?: any) {
    this.sendLog(message, 'WARN', meta);
  }

  error(message: string, meta?: any) {
    this.sendLog(message, 'ERROR', meta);
  }
}
