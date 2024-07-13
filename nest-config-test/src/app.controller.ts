import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(ConfigService)
  private configService: ConfigService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('config')
  getConfig() {
    return {
      // aaa: this.configService.get('aaa'),
      // bbb: this.configService.get('bbb'),
      // db: this.configService.get('db'),
      config: this.configService.get('application'),
    };
  }
}
