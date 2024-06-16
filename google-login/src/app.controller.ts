import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log('googleAuth');
  }

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req) {
    console.log('googleAuthCallback req.user', req.user);
    if (!req.user) {
      return {
        code: -1,
        message: 'No user from google',
        user: null,
      };
    }
    const email = req.user.email;
    if (email) {
      // 用户存在的话就直接登录，不存在就注册下用户，然后登录
      const user = await this.appService.findGoogleUserByEmail(email);
      // (1)根据 email 查询 google 方式登录的 user，如果有，就自动登录
      if (user) {
        // 用户存在的话就直接登录
        return {
          code: 0,
          message: 'success',
          user: user,
        };
      }
      // (2)否则自动注册然后登录
      const newUser = await this.appService.registerByGoogleInfo(req.user);
      return {
        code: 0,
        message: 'success',
        user: newUser,
      };
    }
  }
}
