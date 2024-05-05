import { Test, TestingModule } from '@nestjs/testing';
import { AaaV2Controller } from './aaa-v2.controller';

describe('AaaV2Controller', () => {
  let controller: AaaV2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AaaV2Controller],
    }).compile();

    controller = module.get<AaaV2Controller>(AaaV2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
