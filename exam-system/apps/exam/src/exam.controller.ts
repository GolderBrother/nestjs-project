import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { RedisService } from '@app/redis';
import { RequireLogin, UserInfo } from 'apps/user/src/custom.decorator';
import { ExamAddDto } from './dto/exam-add.dto';
import { ExamSaveDto } from './dto/exam-save.dto';

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

  @Post('add')
  @RequireLogin()
  // 创建考试需要关联用户，所以需要登录，拿到用户信息。
  async add(@Body() dto: ExamAddDto, @UserInfo('userId') userId: number) {
    return await this.examService.add(dto, userId);
  }

  @Post('save')
  @RequireLogin()
  async save(@Body() dto: ExamSaveDto) {
    return await this.examService.save(dto);
  }

  @Get('list')
  @RequireLogin()
  async list(@UserInfo('userId') userId: number, @Query('bin') bin: string) {
    return await this.examService.list(userId, bin);
  }

  @Delete('delete/:id')
  async delete(@UserInfo('userId') userId: number, @Param('id') id: string) {
    return await this.examService.delete(userId, Number(id));
  }

  @Post('publish')
  async publish(@UserInfo('userId') userId: number, @Body('id') id: number) {
    return await this.examService.publish(userId, Number(id));
  }

  @Post('unpublish')
  @RequireLogin()
  async unpublish(@UserInfo('userId') userId: number, @Body('id') id: number) {
    return await this.examService.unpublish(userId, Number(id));
  }

  @Get('find/:id')
  async find(@Param('id') id: string) {
    return await this.examService.find(Number(id));
  }
}
