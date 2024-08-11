import { IsNotEmpty } from 'class-validator';

export class JoinChatRoomDto {
  @IsNotEmpty({
    message: '群聊 id 不能为空',
  })
  id: number;
  @IsNotEmpty({
    message: 'joinUsername 不能为空',
  })
  joinUsername: string;
}
