import { Controller, Get, Inject } from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { RedisService } from '@app/redis';

@Controller()
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Inject(RedisService)
  private redisService: RedisService;

  @Get()
  async getHello(): Promise<string> {
    const keys = await this.redisService.get('*');
    return this.examService.getHello() + keys;
  }

  @MessagePattern('sum')
  sum(numArray: Array<number>): number {
    return numArray.reduce((total, item) => total + item, 0);
  }
}
