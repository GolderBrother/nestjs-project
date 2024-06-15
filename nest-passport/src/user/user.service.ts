import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: 1,
      username: '詹姆斯',
      password: 'james',
    },
    {
      userId: 2,
      username: '勒布朗',
      password: 'zhang',
    },
  ];

  async findOne(username: string) {
    console.log('username', username);
    // TODO 这里应该去数据库查询用户信息
    return this.users.find((user) => user.username === username);
  }
}
