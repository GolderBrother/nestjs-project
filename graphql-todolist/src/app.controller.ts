import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTodoList } from './todolist-create.dto';
import { UpdateTodoList } from './todolist-update.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create')
  async create(@Body() todoItem: CreateTodoList) {
    return await this.appService.create(todoItem);
  }

  @Post('update')
  async update(@Body() todoItem: UpdateTodoList) {
    return await this.appService.update(todoItem);
  }

  @Post('delete')
  async delete(@Body() queryParams: { id: number }) {
    return await this.appService.delete(+queryParams.id);
  }

  @Get('list')
  async getList() {
    return await this.appService.query();
  }
}
