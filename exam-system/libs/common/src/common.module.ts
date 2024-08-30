import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // 通用模块引入 JwtService，其他模块就无需重复引入，只需要引入CommonModule就行
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory() {
        return {
          secret: 'james',
          signOptions: {
            expiresIn: '30m', // 默认 30 分钟
          },
        };
      },
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
