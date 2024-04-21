import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateTodoList } from './todolist-create.dto';
import { UpdateTodoList } from './todolist-update.dto';

@Injectable()
export class AppService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async query() {
    const result = await this.prismaService.todoItem.findMany({
      select: {
        id: true,
        content: true,
        createTime: true,
      },
    });
    return result;
  }

  async create(todoItem: CreateTodoList) {
    const result = await this.prismaService.todoItem.create({
      data: todoItem,
      select: {
        id: true,
        content: true,
        createTime: true,
      },
    });
    return result;
  }

  async update(todoItem: UpdateTodoList) {
    // 用它来做 CRUD，where 是条件、data 是数据，select 是回显的字段
    const result = await this.prismaService.todoItem.update({
      where: {
        id: todoItem.id,
      },
      data: todoItem,
      select: {
        id: true,
        content: true,
        createTime: true,
      },
    });
    return result;
  }

  async delete(id: number) {
    const result = await this.prismaService.todoItem.delete({
      where: {
        id,
      },
    });
    return result;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
