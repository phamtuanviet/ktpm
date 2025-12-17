import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { sleep } from '../common/utils/sleep.util';

@Injectable()
export class ConcurrencyThrottlingInterceptor implements NestInterceptor {
  private inflight = 0;

  private readonly MAX_INFLIGHT = 24;
  private readonly DELAY_START = 18;

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    this.inflight++;

    if (this.inflight > this.MAX_INFLIGHT) {
      this.inflight--;
      throw new HttpException(
        'Too many requests, please slow down',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (this.inflight >= this.DELAY_START) {
      const overloadRatio =
        (this.inflight - this.DELAY_START) /
        (this.MAX_INFLIGHT - this.DELAY_START);

      const delay = Math.min(50, overloadRatio * 50);
      await sleep(delay);
    }

    return next.handle().pipe({
      finalize: () => {
        this.inflight--;
      },
    } as any);
  }
}
