import { Injectable } from '@nestjs/common';

// james 用户用 github 登录过，记录了他的 githubId。
const users = [
  {
    username: 'james',
    githubId: '26534692',
    email: '1204788939@qq.com',
    hobbies: ['running', 'play game'],
  },
  {
    username: 'zhang',
    email: 'xxx@xx.com',
    hobbies: ['learning'],
  },
];

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * 根据 githubId 查询用户信息
   * @param githubId
   * @returns
   */
  findUserByGithubId(
    githubId: string,
    extraData?,
  ): {
    username: string;
    githubId?: string;
    extraData?: Record<string, Record<string, string>>;
    email: string;
    hobbies: string[];
  } {
    // 这里应该去数据库查询
    const user = users.find((user) => user.githubId === githubId);
    if (!user) {
      return null;
    }
    if (extraData) {
      user['extraData'] = extraData;
    }
    return user;
  }
}
