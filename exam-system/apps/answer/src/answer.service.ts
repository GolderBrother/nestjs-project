import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AnswerAddDto } from './dto/answer-add.dto';
import { PrismaService } from '@app/prisma';
import { ExcelService } from '@app/excel';

@Injectable()
export class AnswerService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(ExcelService)
  private excelService: ExcelService;

  getHello(): string {
    return 'Hello World!';
  }
  async add(addDto: AnswerAddDto, userId: number) {
    return await this.prismaService.answer.create({
      data: {
        content: addDto.content,
        score: 0,
        answerer: {
          connect: {
            id: userId,
          },
        },
        exam: {
          connect: {
            id: addDto.examId,
          },
        },
      },
    });
  }
  async list(examId: number) {
    return await this.prismaService.answer.findMany({
      where: {
        examId,
      },
      include: {
        exam: true,
        answerer: true,
      },
    });
  }
  async find(id: number) {
    return await this.prismaService.answer.findUnique({
      where: {
        id,
      },
      include: {
        exam: true,
        answerer: true,
      },
    });
  }
  async export(examId: string) {
    if (!examId) {
      throw new BadRequestException('examId 不能为空');
    }
    const data = await this.list(Number(examId));

    const columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: '分数', key: 'score', width: 30 },
      { header: '答题人', key: 'answerer', width: 30 },
      { header: '试卷', key: 'exam', width: 30 },
      { header: '创建时间', key: 'createTime', width: 30 },
    ];
    const filename = 'answers.xlsx';
    return await this.excelService.export(columns, data, filename);
  }
}
