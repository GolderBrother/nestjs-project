import { Test, TestingModule } from '@nestjs/testing';
import { TodolistResolver } from './todolist.resolver';

describe('TodolistResolver', () => {
  let resolver: TodolistResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodolistResolver],
    }).compile();

    resolver = module.get<TodolistResolver>(TodolistResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
