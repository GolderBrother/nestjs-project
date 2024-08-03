import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, UserInfo } from './custom.decorator';

@Controller()
@RequireLogin()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  @RequireLogin()
  aaa(@UserInfo() userInfo, @UserInfo('username') username) {
    console.log(userInfo, username);
    return userInfo;
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }

}
