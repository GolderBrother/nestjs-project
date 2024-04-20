import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户详情视图对象
 */
export class UserDetailVo {
  /**
   * 用户ID
   */
  @ApiProperty()
  id: number;

  /**
   * 用户名
   */
  @ApiProperty({ example: 'zhangsan' })
  username: string;

  /**
   * 昵称
   */
  @ApiProperty({ example: '张三' })
  nickName: string;

  /**
   * 邮箱
   */
  @ApiProperty({ example: 'xx@xx.com' })
  email: string;

  /**
   * 头像
   */
  @ApiProperty({ example: 'xxx.png' })
  headPic: string;

  /**
   * 手机号码
   */
  @ApiProperty({ example: '13233333333' })
  phoneNumber: string;

  /**
   * 是否被冻结
   */
  @ApiProperty()
  isFrozen: boolean;

  /**
   * 创建时间
   */
  @ApiProperty()
  createTime: Date;
}
