import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_LOGGER_TOKEN } from './winston/winston.module';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // private logger = new Logger();

  // 改成 inject 的方式，始终使用同一个实例，性能更
  @Inject(WINSTON_LOGGER_TOKEN)
  private logger;

  @Get()
  getHello(): string {
    this.logger.log('hello', AppController.name);
    return this.appService.getHello();
  }
}
