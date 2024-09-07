import { Module } from '@nestjs/common';
import { AnalyseController } from './analyse.controller';
import { AnalyseService } from './analyse.service';
import { AuthGuard, CommonModule } from '@app/common';
import { RedisModule } from '@app/redis';
import { PrismaModule } from '@app/prisma';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [CommonModule, RedisModule, PrismaModule],
  controllers: [AnalyseController],
  providers: [
    AnalyseService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AnalyseModule {}
