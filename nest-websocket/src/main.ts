import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 支持 pages 静态目录的访问
  app.useStaticAssets('pages');
  await app.listen(3000);
}
bootstrap();
