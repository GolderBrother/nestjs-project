import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('login')
  // 使用 passport 的 github 策略。
  @UseGuards(AuthGuard('github'))
  async login() {
    console.log('login');
  }

  @Get('callback')
  // 使用 passport 的 github 策略。
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req) {
    // passport 的策略会在验证过后把 validate 的返回值放在 request.user 上。
    // 所以这里可以从 req.user 取到返回的用户信息。
    // 取出 github 返回的 id 来，查询用户信息，即可登录。

    // http://localhost:3000/callback?code=9eafc179cf5d7a7bb279
    // 登录返回的是授权码，然后通过授权码去获取用户信息
    return this.appService.findUserByGithubId(req.user.id, req.user);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
