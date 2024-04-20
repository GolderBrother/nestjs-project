import { BadRequestException, Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Inject(RedisService)
  private redisService: RedisService;

  private getKey = 'positions';

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('addPos')
  async addPos(
    @Query('name') posName: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
  ) {
    if (!posName || !longitude || !latitude) {
      throw new BadRequestException('位置信息不全');
    }
    try {
      await this.redisService.geoAdd(this.getKey, posName, [longitude, latitude]);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return {
      message: '添加成功',
      statusCode: 200
    };
  }

  @Get('getPos')
  async getPos(@Query('name') posName: string) {
    return await this.redisService.geoPos(this.getKey, posName);
  }

  @Get('getAllPos')
  async getAllPos() {
    return await this.redisService.getList(this.getKey);
  }

  @Get('nearbySearch')
  async nearbySearch(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('radius') radius: number,
  ) {
    if (!longitude || !latitude) {
      throw new BadRequestException('缺少位置信息');
    }
    if (!radius) {
      throw new BadRequestException('缺少搜索半径');
    }
    return await this.redisService.geoSearch(this.getKey, [longitude, latitude], radius);
  }
}
