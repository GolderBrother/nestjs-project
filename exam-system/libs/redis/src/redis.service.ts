import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async keys(pattern: string) {
    return this.redisClient.keys(pattern);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: number | string, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  /**
   * zRankingList 查询排行榜成员，加上 REV 是按分数从大到小排
   * @param key
   * @param start
   * @param end
   * @returns
   */
  async zRankList(key: string, start: number = 0, end: number = -1) {
    // 用 zRange 取排好序的前多少个元素，加上 REV 就是按照分数从大到小排序。
    return await this.redisClient.zRange(key, start, end, {
      REV: true,
    });
  }

  /**
   * 用 ZADD 添加成员
   * @param key
   * @param members
   * @returns
   */
  async zAdd(key: string, members: Record<string, number>) {
    // members 对象转数组
    const mems = [];
    for (const key in members) {
      if (Object.prototype.hasOwnProperty.call(members, key)) {
        const member = members[key];
        mems.push({
          value: key,
          score: member,
        });
      }
    }
    return await this.redisClient.zAdd(key, mems);
  }
}
