// shared.module.ts
import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import * as http from 'http';
import * as https from 'https';

@Global() 
@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
      httpAgent: new http.Agent({
        keepAlive: true,        
        maxSockets: 100,    
        maxFreeSockets: 10,
        timeout: 60000,
      }),
    }),
  ],
  exports: [HttpModule], 
})
export class SharedModule {}