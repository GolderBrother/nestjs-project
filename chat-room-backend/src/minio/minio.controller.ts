import { Controller, Get, Inject, Query } from '@nestjs/common';
import * as Minio from 'minio';

@Controller('minio')
export class MinioController {
  @Inject('MINIO_CLIENT')
  private minioClient: Minio.Client;

  @Get('presignedUrl')
  presignedPutObject(@Query('name') name: string) {
    // 3600:生成的临时签名的过期时间，我们指定 3600 秒，也就是一小时
    return this.minioClient.presignedPutObject('chat-room3', name, 3600);
  }
}
