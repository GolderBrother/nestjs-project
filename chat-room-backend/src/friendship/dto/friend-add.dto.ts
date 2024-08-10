import { IsNotEmpty } from 'class-validator';

export class FriendAddDto {
  @IsNotEmpty({
    message: '添加好友的用户名不能为空',
  })
  username: string;

  /** 好友请求 */
  reason: string;
}
