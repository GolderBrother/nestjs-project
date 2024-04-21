import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      // 打印 sql 到控制台
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    });
  }
  onModuleInit() {
    // 初始化数据库连接
    this.$connect();
  }

  // 重写 PrismaClient 的 disconnect 方法，在关闭数据库连接时执行自定义逻辑
  //   override async $disconnect() {
  //     // 执行自定义逻辑
  //     await super.disconnect();
  //   }
}
