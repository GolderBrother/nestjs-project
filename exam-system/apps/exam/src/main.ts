import { NestFactory } from '@nestjs/core';
import { ExamModule } from './exam.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ExamModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      // 用 connectMicroservice 就是再暴露 8888 的 TCP 服务
      port: 8888,
    },
  });

  // 全局校验管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // 开启跨域
  app.enableCors();

  // 暴露了3002端口的 http 服务
  await app.listen(3002);
}
bootstrap();
