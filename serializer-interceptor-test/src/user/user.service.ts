import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const database = [
  new User({ id: 1, username: 'xxx', password: 'xxx', email: 'xxx@xx.com' }),
  new User({ id: 2, username: 'yyy', password: 'yyy', email: 'yyy@yy.com' }),
];
let id = 0;

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    const newUser = new User(createUserDto);
    newUser.id = ++id;
    database.push(newUser);
    return newUser;
  }

  findAll() {
    return database;
  }

  findOne(id: number) {
    return database.filter((user) => user.id === id).at(0);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
