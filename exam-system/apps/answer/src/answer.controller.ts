import { Controller, Get, Inject } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Inject('EXAM_SERVICE')
  private examClient: ClientProxy;

  @Get()
  async getHello(): Promise<string> {
    console.log('getHello');
    // 调用下微服务的 sum 方法
    const result = await firstValueFrom(this.examClient.send('sum', [1, 2, 3]));
    console.log('result', result);
    return this.answerService.getHello() + ': ' + result;
  }
}
