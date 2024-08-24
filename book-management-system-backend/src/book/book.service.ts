import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DbService } from 'src/db/db.service';
import { Book } from './entities/book.entity';

function randomNum() {
  return Math.floor(Math.random() * 1000000);
}

@Injectable()
export class BookService {
  @Inject(DbService)
  private readonly dbService: DbService;
  async delete(id: number) {
    const books: Book[] = await this.dbService.read();
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
      books.splice(index, 1);
      await this.dbService.write(books);
      return 'success';
    }
  }
  async update(updateBookDto: UpdateBookDto) {
    const books: Book[] = await this.dbService.read();

    const foundBook = books.find((book) => book.id === updateBookDto.id);
    console.log('update updateBookDto', updateBookDto);
    console.log('update foundBook', foundBook);
    if (!foundBook) {
      throw new BadRequestException('该图书不存在');
    }

    if (updateBookDto.author !== null && updateBookDto.author !== undefined) {
      foundBook.author = updateBookDto.author;
    }
    if (updateBookDto.cover !== null && updateBookDto.cover !== undefined) {
      foundBook.cover = updateBookDto.cover;
    }
    if (
      updateBookDto.description !== null &&
      updateBookDto.description !== undefined
    ) {
      foundBook.description = updateBookDto.description;
    }
    if (updateBookDto.name !== null && updateBookDto.name !== undefined) {
      foundBook.name = updateBookDto.name;
    }

    await this.dbService.write(books);
    return foundBook;
  }
  async create(createBookDto: CreateBookDto) {
    const books: Book[] = await this.dbService.read();
    const newBook = new Book();
    newBook.id = randomNum();
    newBook.author = createBookDto.author;
    newBook.cover = createBookDto.cover;
    newBook.description = createBookDto.description;
    newBook.name = createBookDto.name;
    books.push(newBook);
    await this.dbService.write(books);
    return newBook;
  }
  async findById(id: number) {
    const books: Book[] = await this.dbService.read();
    return books.find((book) => book.id === id);
  }
  async list(name: string) {
    const books: Book[] = await this.dbService.read();
    console.log('list name', name);
    console.log('list books', books);
    return name
      ? books.filter(
          (book) =>
            book.name.includes(name) ||
            book.author.includes(name) ||
            book.description.includes(name),
        )
      : books;
  }
}
