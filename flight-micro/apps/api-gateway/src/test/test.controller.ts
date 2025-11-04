import { Controller, Get, Query } from '@nestjs/common';
const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

@Controller('api/test')
export class TestController {
  // @Get('check-health')
  // getHeavyTask(): any {
  //   let result = 0;
  //   for (let i = 0; i < 100000000; i++) {
  //     result += Math.sqrt(i);
  //   }
  //   return {
  //     status: 'heavy task done',
  //     result: result,
  //   };
  // }

  @Get('check-health')
  getCpuIntensive(): any {
    const num = 40;

    const result = fibonacci(num);

    return {
      result,
      status: 'heavy fibonacci task done',
    };
  }
}
