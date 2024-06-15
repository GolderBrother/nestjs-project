import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * 从 request 中取出 body 的 username 和 password 交给我们的 validate 方法去认证，认证完会返回 user 信息，放到 request.user 上
   * @param username
   * @param password
   * @returns
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    // 验证逻辑
    return user;
  }
}
