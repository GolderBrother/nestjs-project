import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterUserCaptchaDto } from './dto/register-user-captcha.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  private redisService: RedisService;

  @Get()
  async getHello(): Promise<string> {
    const keys = await this.redisService.get('*');
    return this.userService.getHello() + keys;
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Post('register-captcha')
  async sendRegisterCaptcha(
    @Body() registerUserCaptcha: RegisterUserCaptchaDto,
  ) {
    return await this.userService.sendRegisterCaptcha(registerUserCaptcha);
  }
}
