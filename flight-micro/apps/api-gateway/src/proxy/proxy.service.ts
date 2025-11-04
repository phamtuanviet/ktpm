// proxy.service.ts

import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';
import FormData from 'form-data';

@Injectable()
export class ProxyService {
  async forward(req: Request, targetUrl: string) {
    const method = req.method;

    const formData = new FormData();

    const requestBody = req.body || {};
   if (typeof requestBody === 'object' && requestBody !== null) {
        for (const key in requestBody) {
            if (Object.prototype.hasOwnProperty.call(requestBody, key) && requestBody[key] !== undefined) {
                const value = typeof requestBody[key] === 'object'
                              ? JSON.stringify(requestBody[key])
                              : requestBody[key];
                formData.append(key, value);
            }
        }
    }

    const file = (req as any).file;
    if (file) {
      formData.append(file.fieldname, file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    }

    const {
      host,
      connection,
      'content-length': oldContentLength,
      'content-type': oldContentType,
      ...forwardHeaders
    } = req.headers;

    const formHeaders = formData.getHeaders();

    const deviceInfo =
      req.headers['x-device-info'] ||
      req.headers['user-agent'] ||
      'Unknown device';
    forwardHeaders['x-device-info'] = deviceInfo;

    try {
      const response = await axios({
        url: targetUrl,
        method: method as any,
        headers: {
          ...forwardHeaders,
          ...formHeaders,
        } as Record<string, string>,
        data: formData,
        validateStatus: (status) => status >= 200 && status < 500,
        params: req.query,
      });

      if (response.status >= 400) {
        throw new HttpException(
          response.data.message,
          response.data.statusCode,
        );
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Proxy connection error:', error.message);
        throw new InternalServerErrorException(
          'Cannot connect to downstream service.',
        );
      }
      throw error;
    }
  }
}
