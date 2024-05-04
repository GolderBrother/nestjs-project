import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 全局模块，全局模块的 providers 会被所有模块共享
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
