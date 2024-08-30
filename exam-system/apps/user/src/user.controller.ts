import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterUserCaptchaDto } from './dto/register-user-captcha.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdatePasswordCaptchaDto } from './dto/update-user-password-captcha.dto';

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

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);
    const token = await this.userService.generateJwtToken(user);
    return {
      user,
      token,
    };
  }

  @Post('update_password')
  async updatePassword(@Body() updatePasswordDto: UpdateUserPasswordDto) {
    console.log('updatePasswordDto', updatePasswordDto);
    return await this.userService.updatePassword(updatePasswordDto);
  }

  @Post('update_password/captcha')
  async updatePasswordCaptcha(
    @Body() updatePasswordCaptchaDto: UpdatePasswordCaptchaDto,
  ) {
    return this.userService.updatePasswordCaptcha(updatePasswordCaptchaDto);
  }

  @Get('aaa')
  @SetMetadata('require-login', true)
  aaa() {
    return 'aaa';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }
}
