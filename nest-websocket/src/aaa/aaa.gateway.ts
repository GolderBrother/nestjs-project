import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';

// @WebSocketGateWay 声明这是一个处理 websocket 的类
// 默认的端口和 http 服务 app.listen 的那个端口一样
@WebSocketGateway()
export class AaaGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly aaaService: AaaService) {}

  // 原生的 Socket 实例对象
  @WebSocketServer()
  server: Server;

  // 一些生命周期函数;
  afterInit(server: any) {
    console.log('afterInit server', server);
  }
  handleConnection(client: any, ...args: any[]) {
    console.log('handleConnection client, args', client, args);
  }
  handleDisconnect(client: any) {
    console.log('handleDisconnect client', client);
  }

  // @SubscribeMessage 是指定处理的消息。
  @SubscribeMessage('createAaa')
  create(@MessageBody() createAaaDto: CreateAaaDto) {
    // 通过 @MessageBody 取出传过来的消息内容。
    return this.aaaService.create(createAaaDto);
  }

  @SubscribeMessage('findAllAaa')
  findAll() {
    // return {
    //   event: 'james',
    //   data: this.aaaService.findAll(),
    // };
    // return this.aaaService.findAll();
    // 异步返回消息
    return new Observable((observer) => {
      observer.next({
        event: 'james',
        data: {
          msg: 'aaa',
        },
      });
      // 异步多次返回消息，过几秒再发消息
      setTimeout(() => {
        observer.next({
          event: 'james',
          data: {
            msg: 'bbb',
          },
        });
      }, 2000);
      setTimeout(() => {
        observer.next({
          event: 'james',
          data: {
            msg: 'ccc',
          },
        });
      }, 5000);
    });
  }

  @SubscribeMessage('findOneAaa')
  // @ConnectedSocket 装饰器注入实例
  findOne(@MessageBody() id: number, @ConnectedSocket() server: Server) {
    server.emit('james', 123);
    this.server.emit('james', 456);
    return this.aaaService.findOne(id);
  }

  @SubscribeMessage('updateAaa')
  update(@MessageBody() updateAaaDto: UpdateAaaDto) {
    return this.aaaService.update(updateAaaDto.id, updateAaaDto);
  }

  @SubscribeMessage('removeAaa')
  remove(@MessageBody() id: number) {
    return this.aaaService.remove(id);
  }
}
