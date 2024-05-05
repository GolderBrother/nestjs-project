import { Module } from '@nestjs/common';
import { AaaService } from './aaa.service';
import { AaaController } from './aaa.controller';
import { AaaV2Controller } from './aaa-v2/aaa-v2.controller';

@Module({
  // controller 之间同样要注意顺序，前面的 controller 先生效
  controllers: [AaaV2Controller, AaaController],
  providers: [AaaService],
})
export class AaaModule {}
