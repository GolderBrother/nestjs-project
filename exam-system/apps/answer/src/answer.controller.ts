import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RequireLogin, UserInfo } from 'apps/user/src/custom.decorator';
import { AnswerAddDto } from './dto/answer-add.dto';

@Controller('answer')
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

  @Post('add')
  @RequireLogin()
  async add(@Body() addDto: AnswerAddDto, @UserInfo('userId') userId: number) {
    return await this.answerService.add(addDto, userId);
  }

  @Get('list')
  @RequireLogin()
  async list(@Query('examId') examId: string) {
    if (!examId) throw new BadRequestException('examId 不能为空');
    return await this.answerService.list(Number(examId));
  }

  @Get('find/:id')
  @RequireLogin()
  async find(@Param('id') answerId: string) {
    if (!answerId) throw new BadRequestException('answerId 不能为空');
    return await this.answerService.find(Number(answerId));
  }

  @Get('export')
  async export(@Query('examId') examId: string) {
    if (!examId) throw new BadRequestException('examId 不能为空');
    return await this.answerService.export(examId);
  }
}
