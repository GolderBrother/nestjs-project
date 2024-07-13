import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BbbModule } from './bbb/bbb.module';
import config from './config';
import config2 from './config2';

@Module({
  imports: [
    // 动态模块的 forRoot 用于在 AppModule 里注册，一般指定为全局模块
    ConfigModule.forRoot({
      // envFilePath: [
      //   // 前面的环境变量配置会覆盖后面的
      //   path.join(process.cwd(), '.aaa.env'),
      //   path.join(process.cwd(), '.env'),
      // ],
      // 注册为全局模块
      isGlobal: true,
      // 后面覆盖前面
      load: [config2, config],
    }),
    BbbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
