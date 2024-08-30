import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

interface JwtUserData {
  userId: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ]);

    // 不需要登录
    if (!requireLogin) return true;

    // 请求头的token不存在,提示用户未登录
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    // token已失效
    try {
      const [, token] = authorization.split(' ');
      const data = this.jwtService.verify<JwtUserData>(token);
      const newUser = {
        userId: data.userId,
        username: data.username,
      };
      request.user = newUser;
      // token自动续期
      const newToken = await this.jwtService.sign(newUser, {
        // token 过期时间是 7 天
        expiresIn: '7d',
      });
      response.header('token', newToken);
      return true;
    } catch (error) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
