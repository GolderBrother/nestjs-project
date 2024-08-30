import { PrismaService } from '@app/prisma';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from '@app/redis';
import { EmailService } from '@app/email';
import { RegisterUserCaptchaDto } from './dto/register-user-captcha.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  private logger = new Logger();

  getHello(): string {
    return 'Hello World!';
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.prismaService.user.create({
      data,
      select: {
        id: true,
      },
    });
  }

  async register(registerUser: RegisterUserDto) {
    console.log('registerUser', registerUser);
    // 根据邮箱地址查询 redis 中的验证码，验证通过会把用户信息保存到表中
    const captcha = await this.redisService.get(
      `captcha_${registerUser.email}`,
    );

    // 1、验证码已失效
    if (!captcha)
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    // 2、验证码不正确
    if (registerUser.captcha !== captcha)
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        username: registerUser.username,
      },
    });

    // 3、用户已存在
    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      const registerUserDb = await this.prismaService.user.create({
        data: {
          username: registerUser.username,
          password: registerUser.password,
          email: registerUser.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createTime: true,
        },
      });

      return registerUserDb;
    } catch (error) {
      this.logger.error(error, UserService);
      return null;
    }
  }

  async sendRegisterCaptcha(registerUserCaptcha: RegisterUserCaptchaDto) {
    const code = Math.random().toString().slice(2, 8);
    const address = registerUserCaptcha.email;
    // 向邮箱地址发送一个包含验证码的邮件，并在 redis 里存一份。
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }
}
