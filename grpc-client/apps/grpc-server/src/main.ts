import { NestFactory } from '@nestjs/core';
import { GrpcServerModule } from './grpc-server.module';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<GrpcOptions>(
    GrpcServerModule,
    {
      // 传输方式 transport 改为 GRPC，然后指定微服务监听端口为 8888。
      transport: Transport.GRPC,
      options: {
        url: 'localhost:8888',
        package: 'book',
        protoPath: join(__dirname, 'book/book.proto'),
      },
    },
  );

  await app.listen();
}
bootstrap();
