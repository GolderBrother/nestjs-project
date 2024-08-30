import { Controller, Get, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  private redisService: RedisService;

  @Get()
  async getHello(): Promise<string> {
    const keys = await this.redisService.get('*');
    return this.userService.getHello() + keys;
  }
}
