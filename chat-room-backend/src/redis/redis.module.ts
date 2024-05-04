import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

// 用 @Global() 把它声明为全局模块，这样只需要在 AppModule 里引入，别的模块不用引入也可以注入 RedisService 了
@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          // 把存储的 key-value 的数据放到不同命名空间下，避免冲突。
          database: 2,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
