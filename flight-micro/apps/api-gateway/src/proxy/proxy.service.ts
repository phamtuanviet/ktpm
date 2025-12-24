import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { Request } from 'express'; // Đảm bảo bạn đã cài đặt thư viện 'form-data'
import * as http from 'http';
import * as https from 'https';

// Định nghĩa kiểu dữ liệu cho Request để có thể truy cập 'file' (tùy thuộc vào Multer)
// Trong môi trường thực tế, bạn nên định nghĩa Interface này trong một file riêng
interface CustomRequest extends Request {
  file?: Express.Multer.File; // Sử dụng kiểu của Multer nếu bạn dùng NestJS/Express
  headers: Record<string, any>;
  body: any;
  query: any;
  method: string;
  userCurrent?: any;
}

@Injectable()
export class ProxyService {
  /**
   * Danh sách các headers nên bị LOẠI BỎ hoặc xử lý đặc biệt khi proxy
   */
  private readonly HEADERS_TO_OMIT = [
    'host',
    'connection',
    'content-length',
    'accept-encoding',
    // Thêm các headers khác nếu cần thiết
  ];

  private filterHeaders(
    originalHeaders: Record<string, any>,
  ): Record<string, string> {
    const filteredHeaders: Record<string, string> = {};
    const lowercasedOmittedHeaders = this.HEADERS_TO_OMIT.map((h) =>
      h.toLowerCase(),
    );

    for (const key in originalHeaders) {
      if (
        Object.prototype.hasOwnProperty.call(originalHeaders, key) &&
        !lowercasedOmittedHeaders.includes(key.toLowerCase())
      ) {
        // Ép kiểu giá trị header về string (axios cần điều này)
        filteredHeaders[key] = String(originalHeaders[key]);
      }
    }
    return filteredHeaders;
  }
  private httpAgent = new http.Agent({
    keepAlive: true,        // Bật tính năng giữ kết nối
    maxSockets: 100,        // Cho phép 100 kết nối đồng thời tới mỗi service đích
    maxFreeSockets: 10,     // Giữ lại 10 kết nối rảnh rỗi chờ request tiếp theo
    timeout: 60000,         // Socket sống trong 60s
  });

  async forward(req: CustomRequest, targetUrl: string) {
    const method = req.method;
    const file = req.file;

    // 1. Lọc và sao chép Headers gốc
    let headers: Record<string, string> = this.filterHeaders(req.headers);
    let data: any;

    if (file) {
      // 2a. Xử lý trường hợp có FILE (sử dụng FormData)
      const formData = new FormData();
      formData.append(file.fieldname, file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      // Append các trường dữ liệu khác trong req.body
      const requestBody = req.body || {};
      for (const key in requestBody) {
        if (
          Object.prototype.hasOwnProperty.call(requestBody, key) &&
          requestBody[key] !== undefined
        ) {
          const value =
            typeof requestBody[key] === 'object'
              ? JSON.stringify(requestBody[key])
              : requestBody[key];
          formData.append(key, value);
        }
      }

      data = formData;
      // Gộp headers từ FormData (quan trọng là 'Content-Type: multipart/form-data; boundary=...')
      headers = { ...headers, ...formData.getHeaders() };
    } else {
      // 2b. Xử lý trường hợp KHÔNG có FILE (dùng JSON thông thường)
      data = req.body;
      headers['content-type'] = 'application/json';
    }

    // Forward device info
    headers['x-device-info'] =
      req.headers['x-device-info'] ||
      req.headers['user-agent'] ||
      'Unknown device';

    if (req.userCurrent) {
      headers['x-user'] = JSON.stringify(req.userCurrent);
    }

    


    try {
      const response = await axios({
        url: targetUrl,
        method: method as any,
        headers,
        data,
        params: req.query,
        validateStatus: () => true,
        timeout: 15000, // Tăng timeout lên 15s cho an toàn
        httpAgent: this.httpAgent,
      });

      // 3. Xử lý Lỗi và Chuyển tiếp Status
      if (response.status >= 400) {
        // Chuyển tiếp nguyên trạng response status và data từ downstream service
        // NestJS sẽ dùng status này để gửi response lỗi lại cho client
        throw new HttpException(
          response.data || 'Error from downstream service',
          response.status,
        );
      }

      return response.data;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Proxy error message:', error.message);
      console.error('Proxy error code:', error.code);
      console.error('Proxy error syscall:', error.syscall);
      console.error('Proxy error config url:', error.config?.url);
      console.error('Proxy error response status:', error.response?.status);
      console.error('Proxy error response data:', error.response?.data);

      throw new InternalServerErrorException(
        'Cannot connect to downstream service or proxy network error.',
      );
    }
  }
}
