import { Module, Global } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingRBMQModule } from './logging.rbmq.module';

@Global()
@Module({
  imports: [LoggingRBMQModule],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
