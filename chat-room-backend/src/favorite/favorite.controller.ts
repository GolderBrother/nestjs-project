import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  // Query,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
// import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { RequireLogin, UserInfo } from 'src/custom.decorator';

@RequireLogin() // 需要登录
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  // @Post()
  // create(@Body() createFavoriteDto: CreateFavoriteDto) {
  //   return this.favoriteService.create(createFavoriteDto);
  // }

  // @Get()
  // findAll() {
  //   return this.favoriteService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.favoriteService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFavoriteDto: UpdateFavoriteDto,
  // ) {
  //   return this.favoriteService.update(+id, updateFavoriteDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.favoriteService.remove(+id);
  // }

  @Get('list')
  async list(@UserInfo('userId') userId: number) {
    return this.favoriteService.list(userId);
  }

  @Post('add')
  async add(
    @UserInfo('userId') userId: number,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    // 关联 user 和 chatHistory。
    return this.favoriteService.add(userId, createFavoriteDto.chatHistoryId);
  }

  @Post('del')
  async del(@Body('id') id: number) {
    return this.favoriteService.del(id);
  }
}
