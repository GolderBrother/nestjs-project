import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType;

  // 添加元素到集合
  sAdd(key: string, ...members: string[]) {
    return this.redisClient.sAdd(key, members);
  }

  // 两个集合的交集，存入新集合
  sInterStore(newSetKey: string, set1: string, set2: string) {
    return this.redisClient.sInterStore(newSetKey, [set1, set2]);
  }

  // 某个 key 是否在集合中
  sIsMember(key: string, member: string) {
    return this.redisClient.sIsMember(key, member);
  }

  // 查看所有元素
  sMembers(key: string) {
    return this.redisClient.sMembers(key);
  }

  // 用来判断某个 key 是否存在，返回 1 代表存在，返回 0 代表不存在
  async exists(key: string) {
    const result = await this.redisClient.exists(key);
    return result > 0;
  }
}
