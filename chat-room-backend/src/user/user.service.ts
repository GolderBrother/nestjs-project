import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { EmailService } from 'src/email/email.service';
import { UpdateUserPasswordDto } from './dto/update-user-pasword.dto';

@Injectable()
export class UserService {
  async friendship(userId: number) {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        // 当前用户的好友关系
        friends: true,
        // 他是哪些人的好友
        // inverseFriends: true
      },
    });
    if (foundUser) {
      const friendIdList = foundUser.friends.map((item) => item.friendId);
      const data = await this.prismaService.user.findMany({
        where: {
          id: {
            in: friendIdList,
          },
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          email: true,
        },
      });
      return data;
    }
    return foundUser;
  }
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  private logger = new Logger();

  async create(data: Prisma.UserCreateInput) {
    const res = await this.prismaService.user.create({
      data,
      select: {
        id: true,
      },
    });
    this.logger.log(`adds a new user success`);
    return res;
  }

  async findUserDetailById(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        nickName: true,
        email: true,
        headPic: true,
        createTime: true,
      },
    });
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const captcha = await this.redisService.get(
      `update_user_captcha_${updateUserDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    // 根据 userId 查询用户，修改信息后 update 到数据库。
    const foundUser = await this.findUserDetailById(userId);

    if (foundUser) {
      if (updateUserDto.nickName) {
        foundUser.nickName = updateUserDto.nickName;
      }
      if (updateUserDto.headPic) {
        foundUser.headPic = updateUserDto.headPic;
      }
      if (updateUserDto.email) {
        foundUser.email = updateUserDto.email;
        // await this.redisService.set(`update_user_captcha_`)
      }
      try {
        await this.prismaService.user.update({
          where: {
            id: userId,
          },
          data: foundUser,
        });
        return '用户信息修改成功';
      } catch (error) {
        this.logger.error(error, UserService);
        return '用户信息修改失败';
      }
    }
    return `This action updates a #${userId} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async register(user: RegisterUserDto) {
    // 先检查验证码是否正确，如果正确的话，检查用户是否存在，然后用 prismaService.create 插入数据。
    // const captcha = await this.redisService.get(`captcha_${user.email}`);
    // if (!captcha) {
    //   throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    // }

    // if (user.captcha !== captcha) {
    //   throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    // }

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        username: user.username,
      },
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      const res = await this.prismaService.user.create({
        data: {
          username: user.username,
          password: user.password,
          nickName: user.nickName,
          email: user.email,
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          email: true,
          headPic: true,
          createTime: true,
        },
      });
      return res;
    } catch (e) {
      this.logger.error(e, UserService);
      return null;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        username: loginUserDto.username,
      },
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    delete foundUser.password;
    return foundUser;
  }

  async registerCaptcha(address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return 'success';
  }

  async updatePassword(updatePasswordDto: UpdateUserPasswordDto) {
    console.log('updatePasswordDto', updatePasswordDto);
    // 先查询 redis 中相对应的验证码，检查通过之后根据 email 查询用户信息，修改密码之后 save。
    const captcha = await this.redisService.get(
      `update_password_captcha_${updatePasswordDto.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (updatePasswordDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        username: updatePasswordDto.username,
      },
    });

    foundUser.password = updatePasswordDto.password;

    try {
      await this.prismaService.user.update({
        where: {
          id: foundUser.id,
        },
        data: foundUser,
      });
      return '密码修改成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '密码修改失败';
    }
  }

  async updatePasswordCaptcha(userId: number) {
    if (!userId) {
      throw new BadRequestException('用户ID不能为空');
    }
    const { email: address } = await this.findUserDetailById(userId);
    const emailConfig = {
      to: address,
      subject: '更改密码验证码',
      htmlPrefix: `你的更改密码验证码是: `,
    };
    const updateCaptchaKey = 'update_password_captcha_';
    return await this.sendCaptcha(address, emailConfig, updateCaptchaKey);
  }

  async updateInfoCaptcha(userId: number) {
    console.log('updateInfoCaptcha userId', userId);
    if (!userId) {
      throw new BadRequestException('用户ID不能为空');
    }
    const { email: address } = await this.findUserDetailById(userId);
    console.log('updateInfoCaptcha address', address);
    const emailConfig = {
      to: address,
      subject: '更改用户信息验证码',
      htmlPrefix: `你的验证码是: `,
    };
    const updateCaptchaKey = 'update_user_captcha_';
    return await this.sendCaptcha(address, emailConfig, updateCaptchaKey);
  }

  async sendCaptcha(
    address: string,
    emailConfig = {
      subject: '更改用户信息验证码',
      htmlPrefix: `你的验证码是: `,
    },
    updateCaptchaKey = 'update_captcha_',
  ) {
    if (!address) {
      throw new BadRequestException('邮箱地址不能为空');
    }
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`${updateCaptchaKey}${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: emailConfig.subject || '更改用户信息验证码',
      html: `<p>${emailConfig.htmlPrefix} ${code}</p>`,
    });
    return '验证码发送成功';
  }
}
