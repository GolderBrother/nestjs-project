import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { ChatroomCreateOneToOneDto } from './dto/chatroom.create-one-to-one.dto';
import { JoinChatRoomDto } from './dto/chatroom.join-chatroom';
import { QuitChatRoomDto } from './dto/chatroom.quit-chatroom';

@Controller('chatroom')
@RequireLogin()
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) { }

  // 单聊
  @Post('create-one-to-one')
  async oneToOne(@UserInfo('userId') userId: number, @Body() chatroomCreateOneToOneDto: ChatroomCreateOneToOneDto) {
    if (!chatroomCreateOneToOneDto.friendId) {
      throw new BadRequestException('聊天好友的 id 不能为空')
    }
    console.log('oneToOne userId', userId);
    return this.chatroomService.createOneToOneChatroom(chatroomCreateOneToOneDto.friendId, userId)
  }

  // 群聊
  @Post('create-group')
  async group(@UserInfo('userId') userId: number, @Body('name') name: string) {
    return this.chatroomService.createGroupChatroom(name, userId)
  }

  // 查看一个用户的所有聊天室
  @Get('list')
  async list(@UserInfo('userId') userId: number) {
    if (!userId) {
      throw new BadRequestException('userId 不能为空')
    }
    return await this.chatroomService.list(userId);
  }

  // 查询一个聊天室的所有用户
  @Get('members')
  async members(@Query('chatroomId') chatroomId: number) {
    if (!chatroomId) {
      throw new BadRequestException('chatroomId 不能为空')
    }
    return await this.chatroomService.members(chatroomId);
  }

  @Get('info/:id')
  async info(@Param('id') id: number) {
    if (!id) {
      throw new BadRequestException('id 不能为空')
    }
    return await this.chatroomService.info(id);
  }

  @Post('join')
  async join(@Body() joinChatRoomDto: JoinChatRoomDto) {
    const { id, joinUserId } = joinChatRoomDto;
    if(!id) {
      throw new BadRequestException('id 不能为空')
    }
    if(!joinUserId) {
      throw new BadRequestException('joinUserId 不能为空')
    }
    return await this.chatroomService.join(joinChatRoomDto)
  }

  @Post('quit')
  async quit(@Body() quitChatRoomDto: QuitChatRoomDto) {
    const { id, quitUserId } = quitChatRoomDto;
    if(!id) {
      throw new BadRequestException('id 不能为空')
    }
    if(!quitUserId) {
      throw new BadRequestException('quitUserId 不能为空')
    }
    return await this.chatroomService.quit(quitChatRoomDto)
  }
}
