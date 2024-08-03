import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  await app.listen(3000);
  logger.log('Application is running on: ' + await app.getUrl());
}
bootstrap();
