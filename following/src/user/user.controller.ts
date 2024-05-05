import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }

  @Get('init')
  async init() {
    await this.userService.initData();
    return 'done';
  }

  @Get('follow')
  async follow(@Query('id1') id1: string, @Query('id2') id2: string) {
    if (!id1 || !id2) {
      throw new BadRequestException('id1或者id2 不能为空');
    }
    return await this.userService.follow(+id1, +id2);
  }

  @Get('follow-relationship')
  async followRelationShip(@Query('id') id: string) {
    if (!id) {
      throw new BadRequestException('userId 不能为空');
    }
    return await this.userService.getFollowRelationship(+id);
  }
}
