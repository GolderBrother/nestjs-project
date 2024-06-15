import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  @Inject()
  private userService: UserService;
  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    if (user.password !== password) {
      throw new UnauthorizedException('密码错误');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pwd, ...result } = user;
    // AuthService 里根据用户名密码去校验，需要查询用户的逻辑
    return result;
  }
}
