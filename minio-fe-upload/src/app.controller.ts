import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import * as Minio from 'minio';
import { MINIO_CLIENT } from './minio/minio.module';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(MINIO_CLIENT)
  private minioClient: Minio.Client;

  @Get('test')
  async test() {
    try {
      const objectName = 'hello.json';
      await this.minioClient.fPutObject('aaa', objectName, './package.json');
      return `http://localhost:9000/aaa/${objectName}`;
    } catch (error) {
      console.log(error);
      return '上传失败';
    }
  }

  // url签名，给客户端用
  @Get('presignedUrl')
  async presignedUrl(@Query('name') name: string) {
    console.log('presignedUrl name', name);
    // 进行 url 签名
    return this.minioClient.presignedPutObject('aaa', name);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
