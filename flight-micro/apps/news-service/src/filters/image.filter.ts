import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
  } else {
    callback(new BadRequestException('Only image files are allowed'), false);
  }
};