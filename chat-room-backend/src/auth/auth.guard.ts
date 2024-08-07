import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';

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
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    // 用 reflector 从目标 controller 和 handler 上拿到 require-login 的 metadata。
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ]);

    // 如果没有 metadata，就是不需要登录，返回 true 放行。
    if (!requireLogin) return true;

    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      // 否则从 authorization 的 header 取出 jwt 来，把用户信息设置到 request，然后放行。
      const [, token] = authorization.split(' ');
      // 访问的时候在 Authorization 的 header 带上 jwt 的 token 就能通过 AuthGuard 的鉴权
      const data = this.jwtService.verify<JwtUserData>(token);
      const userInfo = {
        userId: data.userId,
        username: data.username,
      };
      request.user = userInfo;
      // token 的自动续期，也就是访问接口后在 header 返回新 token
      const newToken = this.jwtService.sign(
        {
          userId: userInfo.userId,
          username: userInfo.username,
        },
        {
          expiresIn: '7d',
        },
      );
      response.header('token', newToken);
      return true;
    } catch (error) {
      // 如果 jwt 无效，返回 401 响应，提示 token 失效，请重新登录。
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
