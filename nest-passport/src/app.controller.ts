import { Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IsPublic } from './auth/is-public/is-public.decorator';

export interface JwtUserData {
  userId: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject()
  jwtService: JwtService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // 应用auth策略
  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  list(@Req() req: Request) {
    console.log('list req', req.user);
    return ['111', '222', '333', '444', '555'];
  }
  // 应用local策略
  // local 就是用户名密码的策略
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    console.log('login', req.user);
    const token = await this.jwtService.sign(
      {
        userId: req.user.userId,
        username: req.user.username,
      },
      {
        expiresIn: '0.5h',
      },
    );
    console.log('login token', token);
    return {
      token,
    };
    // 返回用户信息
    return req.user;
  }

  // 应用auth策略
  // @UseGuards(AuthGuard('jwt'))
  // @Get('list')
  // list(@Req() req: Request) {
  //   console.log('list', req.user);
  //   return ['111', '222', '333', '444', '555'];
  // }

  @IsPublic()
  @Get('aaa')
  aaa() {
    return 'aaa';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }
}
