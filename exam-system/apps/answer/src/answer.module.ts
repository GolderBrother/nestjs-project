import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
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
  providers: [AnswerService],
})
export class AnswerModule {}
