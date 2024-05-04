import { Controller, Get, Header, Res, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('download')
  @Header('Content-Disposition', `attachment; filename="james.json"`)
  download(@Res() res: Response) {
    const content = fs.readFileSync('package.json');
    // res.set('Content-Disposition', `attachment; filename="james.json"`);
    res.end(content);
  }

  @Get('download2')
  @Header('Content-Disposition', `attachment; filename="james.json"`)
  download2(@Res() res: Response) {
    const stream = fs.createReadStream('package.json');
    return stream.pipe(res);
  }

  @Get('download3')
  download3() {
    // 获取文件流
    // 原理是 transfer-encoding:chunked
    const stream = fs.createReadStream('studio-micro.png');
    // return new StreamableFile(stream, {
    //   disposition: `attachment; filename="james.json"`,
    // });
    // 返回的响应就是流式的
    return new StreamableFile(stream, {
      type: 'text/plain',
      disposition: `attachment; filename="studio-micro.png"`,
    });
  }
}
