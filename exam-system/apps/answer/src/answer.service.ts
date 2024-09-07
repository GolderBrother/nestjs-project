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
    // 查询考卷
    const exam = await this.prismaService.exam.findUnique({
      where: {
        id: addDto.examId,
      },
    });
    if (!exam) {
      throw new BadRequestException('考卷不存在');
    }
    // 查询考卷中的问题列表
    let examQuestions = [];
    try {
      // 解析出考卷中的问题列表
      examQuestions = JSON.parse(exam.content);
    } catch (error) {}
    // 获取答卷的回答列表
    let answers = [];
    try {
      answers = JSON.parse(addDto.content);
    } catch (error) {}

    let totalScore = 0;
    // 遍历答案列表，跟考卷中的问题列表进行对比
    for (const answer of answers) {
      const question = examQuestions.find((item) => item.id === answer.id);
      if (!question) continue;
      if (question.type === 'input') {
        if (answer.answer.includes(question.answer)) {
          totalScore += question.score;
        }
      } else {
        if (question.answer === answer.answer) {
          totalScore += question.score;
        }
      }
    }
    // 答卷的答案跟卡考卷-问题列表的答案进行对比

    return await this.prismaService.answer.create({
      data: {
        content: addDto.content,
        score: totalScore,
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
