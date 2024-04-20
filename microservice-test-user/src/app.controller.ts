import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 消息匹配什么模式，然后调用这个方法，处理参数，返回结果
  @MessagePattern('sum')
  sum(numArr: Array<number>) {
    return numArr.reduce((total, next) => total + next, 0);
  }

  // 不需要返回消息
  @EventPattern('log')
  log(str: string) {
    console.log(str);
  }
}
