import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientGrpc } from '@nestjs/microservices';

interface FindById {
  id: number;
}
interface Book {
  id: number;
  name: string;
  desc: string;
}
interface BookService {
  findBook(params: FindById): Book;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject('BOOK_PACKAGE')
  private client: ClientGrpc;

  private bookService: BookService;

  onModuleInit() {
    this.bookService = this.client.getService<BookService>('BookService');
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('book/:id')
  getBook(@Param('id') id: number) {
    return this.bookService.findBook({ id });
  }
}
