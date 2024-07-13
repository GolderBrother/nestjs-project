import { Module } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { BbbController } from './bbb.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // 注册局部模块
    // forFeature 用于局部配置，在不同模块里 imports，而 register 用于一次性的配置
    ConfigModule.forFeature(() => ({
      ddd: 2,
    })),
  ],
  controllers: [BbbController],
  providers: [BbbService],
})
export class BbbModule {}
