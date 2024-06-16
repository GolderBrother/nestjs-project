import { Global, Module } from '@nestjs/common';
import * as Minio from 'minio';

export const MINIO_CLIENT = 'MINIO_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: MINIO_CLIENT,
      async useFactory() {
        const client = await new Minio.Client({
          endPoint: 'localhost',
          port: 9000,
          useSSL: false,
          accessKey: 'K6YNq13joN7WQh7CzYn7',
          secretKey: 't1zHP57SNWY1vtWAHNPFvIw8auhWOXNiAlOq15nV',
        });
        return client;
      },
    },
  ],
  exports: [MINIO_CLIENT],
})
export class MinioModule {}
