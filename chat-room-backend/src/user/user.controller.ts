import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { Prisma } from '@prisma/client';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UpdateUserPasswordDto } from './dto/update-user-pasword.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService

  @Get('/register-captcha')
  async captcha(@Query('address') address: string) {
    return await this.userService.registerCaptcha(address);
  }

  // "username": "james",
  // "nickName ": "jameszhang",
  // "password":"123456”,
  // "emai1":"xxxx@xx.com",
  // "captcha": "abc123"
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);

    return {
      user,
      token: this.jwtService.sign({
        userId: user.id,
        username: user.username
      }, {
        expiresIn: '7d'
      })
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    return await this.userService.findUserDetailById(userId);
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.userService.create(createUserDto);
  }

  @Post('update')
  @RequireLogin()
  update(@UserInfo('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('update_password')
  async updatePassword(@Body() updatePasswordDto: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(updatePasswordDto)
  }

  @Post('update_captcha')
  @RequireLogin()
  async updateCaptcha(@UserInfo('userId') userId: number) {
    return await this.userService.updateCaptcha(userId);
  }

  @Post('send_captcha')
  async sendCaptcha(@Body('email') email: string) {
    return await this.userService.sendCaptcha(email, {
      subject: '发送验证码'
    });
  }

  @Get('friendship')
  @RequireLogin()
  async friendship(@UserInfo('userId') userId: number) {
    return await this.userService.friendship(userId)
  }
}
