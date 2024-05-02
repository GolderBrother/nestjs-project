import { Inject, Injectable } from '@nestjs/common';
import { CreateBbbDto } from './dto/create-bbb.dto';
import { UpdateBbbDto } from './dto/update-bbb.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BbbService {
  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2;

  // @OnEvent('aaa.find')
  @OnEvent('aaa.*') // 用 aaa.* 通配符匹配
  handleAaaFind(data) {
    console.log('aaa find 调用', data);
    this.create(new CreateBbbDto());
  }

  create(createBbbDto: CreateBbbDto) {
    return 'This action adds a new bbb';
  }

  findAll() {
    return `This action returns all bbb`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bbb`;
  }

  update(id: number, updateBbbDto: UpdateBbbDto) {
    return `This action updates a #${id} bbb`;
  }

  remove(id: number) {
    return `This action removes a #${id} bbb`;
  }
}
