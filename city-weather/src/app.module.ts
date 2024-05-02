import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    // 统一配置 axios，然后各个模块都用同一个 axios 实例
    HttpModule.register({
      timeout: 5000,
      // baseURL: ''
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
