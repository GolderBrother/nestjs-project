import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  chatHistory: any;
  // 在 constructor 里设置 PrismaClient 的 log 参数，也就是打印 sql 到控制台
  constructor() {
    super({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    // 调用 $connect 来连接数据库
    await this.$connect();
  }
}
