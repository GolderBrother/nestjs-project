import { Module } from '@nestjs/common';
import { AnalyseController } from './analyse.controller';
import { AnalyseService } from './analyse.service';
import { CommonModule } from '@app/common';

@Module({
  imports: [CommonModule],
  controllers: [AnalyseController],
  providers: [AnalyseService],
})
export class AnalyseModule {}
