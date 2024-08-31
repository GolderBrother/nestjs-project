import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGuard, CommonModule } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@app/prisma';
import { ExcelModule } from '@app/excel';

@Module({
  imports: [
    PrismaModule,
    CommonModule,
    ExcelModule,
    ClientsModule.register([
      {
        name: 'EXAM_SERVICE',
        transport: Transport.TCP,
        // 用客户端模块连接上exam暴露的 8888 端口的微服务
        options: {
          port: 8888,
        },
      },
    ]),
  ],
  controllers: [AnswerController],
  providers: [
    AnswerService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AnswerModule {}
