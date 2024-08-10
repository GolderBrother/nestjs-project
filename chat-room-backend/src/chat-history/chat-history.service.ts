import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatHistory } from './entities/chat-history.entity';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
export type HistoryDto = Pick<
  ChatHistory,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  'chatroomId' | 'senderId' | 'type' | 'content'
>;

@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list(chatroomId: number) {
    const history = await this.prismaService.chatHistory.findMany({
      where: {
        chatroomId,
      },
    });

    const res = [];
    for (let i = 0; i < history.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: history[i].senderId,
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          email: true,
          createTime: true,
          headPic: true,
        },
      });
      res.push({
        ...history[i],
        sender: user,
      });
    }
    return res;
  }

  async add(chatroomId: number, history: HistoryDto) {
    return this.prismaService.chatHistory.create({
      data: history,
    });
  }

  create(createChatHistoryDto: CreateChatHistoryDto) {
    console.log('createChatHistoryDto', createChatHistoryDto);
    return 'This action adds a new chatHistory';
  }

  findAll() {
    return `This action returns all chatHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatHistory`;
  }

  update(id: number, updateChatHistoryDto: UpdateChatHistoryDto) {
    console.log('updateChatHistoryDto', updateChatHistoryDto);
    return `This action updates a #${id} chatHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatHistory`;
  }
}
