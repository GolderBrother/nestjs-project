import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import pinyin from 'pinyin';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 将中文转换为拼音
  @Get('pinyin')
  pinyin(@Query('text') text: string) {
    return pinyin(text, {
      style: pinyin.STYLE_NORMAL,
    }).join('');
  }

  @Get('weather/:city')
  weather(@Param('city') city: string) {
    return this.appService.getWeather(city);
  }
}
