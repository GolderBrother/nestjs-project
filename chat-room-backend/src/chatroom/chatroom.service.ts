import { BadRequestException, Get, Inject, Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JoinChatRoomDto } from './dto/chatroom.join-chatroom';
import { QuitChatRoomDto } from './dto/chatroom.quit-chatroom';

@Injectable()
export class ChatroomService {
    @Inject(PrismaService)
    private prismaService: PrismaService

    /**
     * 单聊
     * @param friendId 
     * @param userId 
     */
    async createOneToOneChatroom(friendId: number, userId: number) {
        const randomId = Math.random().toString().slice(2, 8);
        const chatroom = await this.prismaService.chatroom.create({
            data: {
                name: '聊天室_' + randomId,
                type: false,
            },
            select: {
                id: true
            }
        })
        if (chatroom) {
            const { id: chatroomId } = chatroom;
            // 单聊把 user 和 friend 加入聊天室
            await this.prismaService.userChatroom.create({
                data: {
                    userId,
                    chatroomId
                }
            });
            await this.prismaService.userChatroom.create({
                data: {
                    userId: friendId,
                    chatroomId
                }
            });
            return '创建成功'
        }
    }
    /**
     * 群聊
     * @param name 
     * @param userId 
     */
    async createGroupChatroom(name: string, userId: number) {
        // 群聊只把 user 加入聊天室。
        const chatroom = await this.prismaService.chatroom.create({
            data: {
                name,
                type: true,
            },
            select: {
                id: true
            }
        })
        if (chatroom) {
            const { id: chatroomId } = chatroom;
            // 单聊把 user 和 friend 加入聊天室
            await this.prismaService.userChatroom.create({
                data: {
                    userId,
                    chatroomId
                }
            });
            return '创建成功'
        }
    }

    async list(userId: number) {
        //   1、首先查询 userId 的所有 chatrooms 的 id
        const chatroomList = await this.prismaService.userChatroom.findMany({
            where: {
                userId
            },
            select: {
                chatroomId: true
            }
        })
        const chatroomIds = chatroomList.map(item => item.chatroomId);
        //  2、然后批量查询所有相关的 userChatroom 记录
        const userChatroomList = await this.prismaService.userChatroom.findMany({
            where: {
                chatroomId: {
                    in: chatroomIds
                }
            },
            select: {
                chatroomId: true,
                // 查询下相关 user 的信息
                userId: true
            }
        });

        // 创建一个映射，存储每个聊天室的用户信息
        const chatroomUserMap = new Map();
        userChatroomList.forEach(record => {
            if (!chatroomUserMap.has(record.chatroomId)) {
                chatroomUserMap.set(record.chatroomId, []);
            }
            chatroomUserMap.get(record.chatroomId).push(record.userId);
        });

        // 构建结果
        const res = chatroomList.map(chatroom => {
            const userIds = chatroomUserMap.get(chatroom.chatroomId) || [];
            return {
                ...chatroom,
                // 包含用户信息
                userCount: userIds.length,
                userIds: userIds
            };
        });

        return res;
    }

    /**
     * 查询一个聊天室的所有用户
     * @param chatroomId 
     * @returns 
     */
    async members(chatroomId: number) {
        const userChatroomList = await this.prismaService.userChatroom.findMany({
            where: {
                chatroomId
            },
            select: {
                userId: true
            }
        })
        const userIds = userChatroomList.map(item => item.userId)
        const users = await this.prismaService.user.findMany({
            where: {
                id: {
                    in: userIds
                }
            },
            select: {
                id: true,
                username: true,
                nickName: true,
                headPic: true,
                createTime: true,
                email: true
            }
        })
        return users
    }


    /**
     * 查询聊天室信息
     * @param id 
     * @returns 
     */
    async info(id: number) {
        if (id) {
            const chatroomInfo = await this.prismaService.chatroom.findUnique({
                where: {
                    id
                }
            })
            const members = await this.members(id)
            return {
                ...chatroomInfo,
                users: members
            };
        }
    }

    /**
     * 加入群聊
     * @param joinChatRoomDto 
     */
    async join(joinChatRoomDto: JoinChatRoomDto) {
        const { id, joinUserId } = joinChatRoomDto;

        const chatroom = await this.prismaService.chatroom.findUnique({
            where: {
                id
            }
        })

        if (chatroom?.type === false) {
            throw new BadRequestException('一对一聊天室不能加人');
        }

        // 加入群聊
        await this.prismaService.userChatroom.create({
            data: {
                userId: joinUserId,
                chatroomId: id
            }
        })

        return '加入成功';
    }

    /**
     * 退出群聊
     * @param quitChatRoomDto 
     * @returns 
     */
    async quit(quitChatRoomDto: QuitChatRoomDto) {
        const { id, quitUserId } = quitChatRoomDto;
        const chatroom = await this.prismaService.chatroom.findUnique({
            where: {
                id
            }
        })

        if (chatroom?.type === false) {
            throw new BadRequestException('一对一聊天室不能加人');
        }

        // 加入群聊
        await this.prismaService.userChatroom.deleteMany({
            where: {
                userId: quitUserId,
                chatroomId: id
            }
        })

        return '退出成功';
      }
}
