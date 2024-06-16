import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());

  // 如果是英文网站，需要返回英文的错误信息，但是 dto 不在 IoC 容器里，不能注入 I18nService，怎么办呢？
  // 这时候可以用 nestjs-i18n 提供的 I18nValidationPipe 来替换 ValidationPipe。
  app.useGlobalPipes(new I18nValidationPipe());

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
