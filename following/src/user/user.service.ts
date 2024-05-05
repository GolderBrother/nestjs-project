import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  @InjectEntityManager()
  entityManager: EntityManager;

  @Inject(RedisService)
  redisService: RedisService;

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async initData() {
    const user2 = new User();
    user2.name = '李四';

    const user3 = new User();
    user3.name = '王五';

    const user4 = new User();
    user4.name = '赵六';

    // const str = '张三李四王五赵六孙七周八吴九郑十'

    const user5 = new User();
    user5.name = '孙七';

    await this.entityManager.save(user2);
    await this.entityManager.save(user3);
    await this.entityManager.save(user4);
    await this.entityManager.save(user5);

    const user1 = new User();
    user1.name = '张三';

    user1.followers = [user2, user3, user4];
    user1.following = [user2, user5];
    await this.entityManager.save(user1);
    return 'init data success';
  }

  async findUserByIds(userIds: string[] | number[]) {
    const users = [];
    for (const id of userIds) {
      const user = await this.entityManager.findOne(User, {
        where: {
          id: +id,
        },
      });
      if (user) users.push(user);
    }
    return users;
  }

  async getFollowRelationship(userId: number) {
    const exists = await this.redisService.exists(`followers:${userId}`);
    if (!exists) {
      const user = await this.entityManager.findOne(User, {
        where: {
          id: userId,
        },
        relations: ['followers', 'following'],
      });

      if (!user.followers.length || !user.following) {
        return {
          followers: user.followers,
          following: user.following,
          followEachOther: [],
        };
      }

      const followers = user.followers.map((item) => item.id.toString());
      const following = user.following.map((item) => item.id.toString());

      await this.redisService.sAdd(`followers:${userId}`, ...followers);
      await this.redisService.sAdd(`following:${userId}`, ...following);
      // 求两个集合的交集，存入 follow-each-other:userId 的集合
      await this.redisService.sInterStore(
        `follow-each-other:${userId}`,
        `followers:${userId}`,
        `following:${userId}`,
      );

      // 取 redis 里的这三个集合
      const followEachOtherIds = await this.redisService.sMembers(
        `follow-each-other:${userId}`,
      );

      const followEachOtherUsers = await this.findUserByIds(followEachOtherIds);

      return {
        followers: user.followers,
        following: user.following,
        followEachOther: followEachOtherUsers,
      };
    } else {
      // 如果 exits 判断 followers 集合存在，就是处理过了，那就直接取 redis 里的这三个集合
      const followerIds = await this.redisService.sMembers(
        'followers:' + userId,
      );

      const followUsers = await this.findUserByIds(followerIds);

      const followingIds = await this.redisService.sMembers(
        'following:' + userId,
      );

      const followingUsers = await this.findUserByIds(followingIds);

      // 根据集合的 id 求出用户信息
      const followEachOtherIds = await this.redisService.sMembers(
        'follow-each-other:' + userId,
      );

      const followEachOtherUsers = await this.findUserByIds(followEachOtherIds);

      return {
        followers: followUsers,
        following: followingUsers,
        followEachOtherUsers: followEachOtherUsers,
      };
    }
  }

  async follow(userId: number, userId2: number) {
    // 先查询出 user 的数据，在 followers 添加 user2，然后 save 保存到数据库
    const user = await this.entityManager.findOne(User, {
      where: {
        id: userId,
      },
      relations: ['following', 'followers'],
    });

    const user2 = await this.entityManager.findOne(User, {
      where: {
        id: userId2,
      },
    });

    user.followers.push(user2);
    await this.entityManager.save(User, user);

    const followerExists = await this.redisService.exists(
      `followers:${userId}`,
    );
    if (followerExists) {
      // 如果有 followers:userId 的 key，就更新下 followers 和 follow-each-other 集合
      await this.redisService.sAdd('followers:' + userId, userId2.toString());
      await this.redisService.sInterStore(
        'follow-each-other:' + userId,
        'followers:' + userId,
        'following:' + userId,
      );
    }

    const followingExists = await this.redisService.exists(
      `following:${userId2}`,
    );
    if (followingExists) {
      await this.redisService.sAdd('following:' + userId2, userId.toString());
      await this.redisService.sInterStore(
        'follow-each-other:' + userId2,
        'followers:' + userId2,
        'following:' + userId2,
      );
    }

    return 'done';
  }
}
