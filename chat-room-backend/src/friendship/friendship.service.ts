import { Inject, Injectable } from '@nestjs/common';
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
        fromUserId: userId,
        toUserId: friendId,
        status: 0,
      },
      data: {
        status: 1,
      },
    });
    // 同意好友申请之后在 friendship 好友关系表添加一条记录。
    const records = await this.prismaService.friendRequest.findMany({
      where: {
        fromUserId: userId,
        toUserId: friendId,
      },
    });
    const hasRecord = Boolean(records.length);
    // 添加之前先查询下，如果已经有好友了，就不用添加了。
    if (hasRecord) {
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
    return await this.prismaService.friendRequest.findMany({
      where: {
        fromUserId: userId,
      },
    });
  }
  async add(friendAddDto: FriendAddDto, userId: number) {
    return await this.prismaService.friendRequest.create({
      data: {
        // @ts-ignore
        fromUserId: userId,
        toUserId: friendAddDto.friendId,
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
