import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // transform 指定为 true，这样会自动把参数的 js 对象转换为 dto 类型对象
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
