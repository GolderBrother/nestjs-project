import { Inject } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { CreateTodoList } from 'src/todolist-create.dto';
import { UpdateTodoList } from 'src/todolist-update.dto';

@Resolver()
export class TodolistResolver {
  @Inject(PrismaService)
  private prismaService: PrismaService;
  // 增删改查接口

  // 查询所有待办事项列表
  @Query('todolist')
  async todoList() {
    return await this.prismaService.todoItem.findMany();
  }

  // 查询单个待办事项详情
  @Query('queryById')
  async queryById(@Args('id') id: number) {
    const result = await this.prismaService.todoItem.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  }

  // 新增待办事项
  @Mutation('createTodoItem')
  async createTodoItem(@Args('todoItem') todoItem: CreateTodoList) {
    console.log('todoItem', todoItem);
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

  // 修改待办事项
  @Mutation('updateTodoItem')
  async updateTodoItem(@Args('todoItem') todoItem: UpdateTodoList) {
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

  // 删除待办事项
  @Mutation('removeTodoItem')
  async removeTodoItem(@Args('id') id: number) {
    const result = await this.prismaService.todoItem.delete({
      where: {
        id,
      },
    });
    return result;
  }
}
