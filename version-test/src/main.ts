import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const extractor = (request: Request) => {
    // 如果有 disable-custom 的 header 就返回 404
    if (request.headers['disable-custom']) {
      return '';
    }
    // 自己实现一个版本号的逻辑，如果 url 里包含 james，就返回版本 2 的接口，否则返回版本 1 的
    return request.url.includes('james') ? '2' : '1';
  };

  app.enableVersioning({
    // 1、type: VersioningType.HEADER, // 指定 header: 'version',
    // 2、type: VersioningType.MEDIA_TYPE, // MEDIA_TYPE 是在 accept 的 header 里携带版本号 Accept=application/json;vv=1，key: 'vv=',
    // 3、type: VersioningType.URI, // 这种方式不支持 VERSION_NEUTRAL，你要指定明确的版本号才可以
    // 比如 http://localhost:3000/v1/aaa ,需要指定 version: ['1', '3']

    type: VersioningType.CUSTOM,
    extractor,
  });
  await app.listen(3000);
}
bootstrap();
