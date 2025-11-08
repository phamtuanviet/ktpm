import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { Request } from 'express'; // Đảm bảo bạn đã cài đặt thư viện 'form-data'

// Định nghĩa kiểu dữ liệu cho Request để có thể truy cập 'file' (tùy thuộc vào Multer)
// Trong môi trường thực tế, bạn nên định nghĩa Interface này trong một file riêng
interface CustomRequest extends Request {
  file?: Express.Multer.File; // Sử dụng kiểu của Multer nếu bạn dùng NestJS/Express
  headers: Record<string, any>;
  body: any;
  query: any;
  method: string;
  
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
    'cookie',
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

    try {
      const response = await axios({
        url: targetUrl,
        method: method as any, // Sử dụng 'as any' cho method là chấp nhận được
        headers,
        data,
        params: req.query,
        validateStatus: () => true, // Cho phép Axios nhận tất cả trạng thái
        timeout: 15000, // Tăng timeout lên 15s cho an toàn
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
    } catch (error) {
      // Bắt các lỗi kết nối (timeout, DNS, network,...) và HttpException đã ném ở trên
      if (error instanceof HttpException) {
        throw error; // Ném lại lỗi đã được chuyển tiếp
      }

      // Xử lý lỗi kết nối Axios thực sự
      console.error('Proxy connection error:', error.message);
      console.error('Axios error response:', error.response?.data);
      throw new InternalServerErrorException(
        'Cannot connect to downstream service or proxy network error.',
      );
    }
  }
}
