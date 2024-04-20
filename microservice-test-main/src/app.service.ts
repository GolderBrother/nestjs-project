import { Get, Query, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // 通过 ClientsModule 来注入连接这个微服务的代理对象。
  @Inject('USER_SERVICE')
  private userClient: ClientProxy;

  @Get('sum')
  calc(@Query() sum: string) {
    const numArr = sum.split(',').map((item) => parseInt(item));
    // 如果是 @MessagePattern 声明的方法，这边要用 send 方法调用。而 @EventPattern 声明的方法，这边要用 emit 方法调用
    this.userClient.emit('log', '求和');
    // 第一个是消息的名字，第二个是参数。
    return this.userClient.send('sum', numArr);
  }
}
