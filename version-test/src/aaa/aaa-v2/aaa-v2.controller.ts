import { Controller, Get, Version } from '@nestjs/common';
import { AaaService } from '../aaa.service';

@Controller({
  path: 'aaa',
  version: '2', // 添加版本号
})
export class AaaV2Controller {
  constructor(private readonly aaaService: AaaService) {}

  //   @Version('2')
  @Get()
  findAllV2() {
    return this.aaaService.findAll() + ' v2';
  }
}
