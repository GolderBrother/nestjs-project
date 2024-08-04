import { Body, Controller, Delete, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { FriendAddDto } from './dto/friend-add.dto';

@Controller('friendship')
@RequireLogin()
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) { }

  @Post('add')
  async add(@Body() friendAddDto: FriendAddDto, @UserInfo('userId') userId: number) {
    return await this.friendshipService.add(friendAddDto, userId);
  }

  // 查询当前登录用户的所有好友申请
  @Get('request_list')
  async list(@UserInfo('userId') userId: number) {
    return await this.friendshipService.list(userId);
  }

  @Get('agree/:id')
  async agree(@Param('id') friendId: number, @UserInfo('userId') userId: number) {
    return await this.friendshipService.agree(friendId, userId);

  }

  @Get('reject/:id')
  async reject(@Param('id') friendId: number, @UserInfo('userId') userId: number) {
    return await this.friendshipService.reject(friendId, userId);
  }

  @Get('list')
  async friendship(@UserInfo('userId') userId: number, @Query('name') name: string) {
    return this.friendshipService.getFriendship(userId, name);
  }

  @Delete('remove/:id')
  async remove(@Param('id') friendId: number, @UserInfo('userId') userId: number) {
    return this.friendshipService.remove(friendId, userId);
  }
}
