import { Controller, Get, Query } from '@nestjs/common';
import { AnalyseService } from './analyse.service';

@Controller('analyse')
export class AnalyseController {
  constructor(private readonly analyseService: AnalyseService) {}

  @Get()
  getHello(): string {
    return this.analyseService.getHello();
  }

  @Get('ranking') // 获取某个考试的分析报告
  rankList(@Query('examId') examId: string) {
    return this.analyseService.rankList(Number(examId));
  }
}
