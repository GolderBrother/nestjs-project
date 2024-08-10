import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendAddDto } from './dto/friend-add.dto';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async getFriendship(userId: number, name: string) {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        friends: true,
        // inverseFriends: true
      },
    });
    const list = await this.prismaService.user.findMany({
      where: {
        id: {
          in: foundUser.friends.map((item) => item.friendId),
        },
        nickName: {
          contains: name,
        },
      },
      select: {
        id: true,
        username: true,
        nickName: true,
        email: true,
      },
    });
    return list;
  }

  async agree(friendId: number, userId: number) {
    // 更新好友添加申请状态
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0,
      },
      data: {
        status: 1,
      },
    });

    // 同意好友申请之后在 friendship 好友关系表添加一条记录。
    const records = await this.prismaService.friendship.findMany({
      where: {
        userId,
        friendId,
      },
    });

    const hasRecord = Boolean(records.length);
    if (!hasRecord) {
      await this.prismaService.friendship.create({
        data: {
          userId,
          friendId,
        },
      });
    }
    return '添加成功';
  }

  async reject(friendId: number, userId: number) {
    // 更新好友添加申请状态
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0,
      },
      data: {
        status: 2,
      },
    });
    return '已拒绝';
  }
  async list(userId: number) {
    // 我发出的好友申请请求
    const fromMeRequest = await this.prismaService.friendRequest.findMany({
      where: {
        fromUserId: userId,
      },
    });

    // 发给我的好友申请请求
    const toMeRequest = await this.prismaService.friendRequest.findMany({
      where: {
        toUserId: userId,
      },
    });

    const res = {
      toMe: [],
      fromMe: [],
    };

    for (let i = 0; i < fromMeRequest.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: fromMeRequest[i].toUserId,
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
      res.fromMe.push({
        ...fromMeRequest[i],
        toUser: user,
      });
    }

    for (let i = 0; i < toMeRequest.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: toMeRequest[i].fromUserId,
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
      res.toMe.push({
        ...toMeRequest[i],
        fromUser: user,
      });
    }

    return res;
  }

  async add(friendAddDto: FriendAddDto, userId: number) {
    const friend = await this.prismaService.user.findUnique({
      where: {
        username: friendAddDto.username,
      },
    });
    // 判断不存在
    // 不能跟当前登录用户ID一样，或者说不能添加自己为好友
    // 先根据 username 查询 user，如果不存在就返回错误，提示 username 不存在。
    if (!friend) {
      throw new BadRequestException('要添加的 username 不存在');
    }

    // 如果添加的是自己，返回错误，提示不能添加自己为好友。
    if (friend.id === userId) {
      throw new BadRequestException('不能添加自己为好友');
    }
    // 判断是否已经添加过这个好友
    const foundUser = await this.prismaService.friendship.findMany({
      where: {
        userId: userId,
        friendId: friend.id,
      },
    });
    // 如果已经添加过，返回错误，提示已经添加。
    if (foundUser.length) {
      throw new BadRequestException('该好友已经添加过');
    }
    return await this.prismaService.friendRequest.create({
      data: {
        fromUserId: userId,
        toUserId: friend.id,
        reason: friendAddDto.reason,
        status: 0,
      },
    });
  }
  async remove(id: number, userId: number) {
    return await this.prismaService.friendship.deleteMany({
      where: {
        userId,
        friendId: id,
      },
    });
  }
}
