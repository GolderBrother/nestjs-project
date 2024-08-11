import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { UserService } from 'src/user/user.service';

interface JoinRoomPayload {
  chatroomId: number;
  userId: number;
}

interface SendMessagePayload {
  sendUserId: number;
  chatroomId: number;
  message: {
    type: 'text' | 'image';
    content: string;
  };
}

// @WebSocketGateway是一个装饰器，用于创建WebSocket网关类。WebSocket网关类是用于处理 WebSocket连接和消息的核心组件之一。
// 它充当WebSocket服务端的中间人，负责处理客户端发起的连接请求，并定义处理不同类型消息的逻辑
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  @Inject(ChatHistoryService)
  private chatHistoryService: ChatHistoryService;

  @Inject(UserService)
  private userService: UserService;

  /**
   * joinRoom 把 client socket 加入房间，房间号为直接用聊天室 id
   * @param client
   * @param payload
   */
  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: JoinRoomPayload): void {
    const roomName = payload.chatroomId.toString();

    client.join(roomName);

    this.server.to(roomName).emit('message', {
      type: 'joinRoom',
      userId: payload.userId,
    });
  }

  /**
   * sendMessage 接收并广播消息到对应房间的所有用户。
   * @param payload
   */
  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() payload: SendMessagePayload): Promise<void> {
    const { chatroomId, message, sendUserId } = payload;
    const roomName = chatroomId.toString();
    // 聊天记录的保存，每个房间聊天的时候都会把聊天内容存到数据库里
    const history = await this.chatHistoryService.add(chatroomId, {
      content: message.content,
      type: message.type === 'image' ? 1 : 0,
      chatroomId: chatroomId,
      senderId: sendUserId,
    });
    const sender = await this.userService.findUserDetailById(history.senderId);
    // message 的格式为 type、content，type 可以是 text、image，也就是可以发送文字、图片。
    this.server.to(roomName).emit('message', {
      type: 'sendMessage',
      userId: sendUserId,
      message: {
        ...history,
        sender,
      },
    });
  }

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
