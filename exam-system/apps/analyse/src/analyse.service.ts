import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AnalyseService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  getHello(): string {
    return 'Hello World!';
  }

  async rankList(examId: number) {
    // 查询 examId 对应的答卷数据
    const answers = await this.prismaService.answer.findMany({
      where: {
        examId,
      },
    });

    // 用 zAdd 加到对应的榜单
    for (const answer of answers) {
      const { id, score } = answer;
      await this.redisService.zAdd(`ranking:${examId}`, {
        [id]: score,
      });
    }
    // 然后返回榜单前 10 名
    const answerIdList = await this.redisService.zRankList(
      `ranking:${examId}`,
      0,
      10,
    );
    const res = [];
    for (const answerId of answerIdList) {
      const answer = await this.prismaService.answer.findUnique({
        where: {
          id: Number(answerId),
        },
        // include 关联查询答题者和试卷的信息，一起返回。
        include: {
          answerer: true,
          exam: true,
        },
      });
      res.push(answer);
    }
    return res;
  }
}
