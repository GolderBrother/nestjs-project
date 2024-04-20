#  Nest 实现 WebSocket 服务。

需要用到 @nestjs/websockets 和 @nestjs/platform-socket.io 包。

涉及到这些装饰器：

@WebSocketGateWay：声明这是一个处理 weboscket 的类。

@SubscribeMessage：声明处理的消息。

@MessageBody：取出传过来的消息内容。

@WebSocketServer：取出 Socket 实例对象

@ConnectedSocket：取出 Socket 实例对象注入方法

客户端也是使用 socket.io 来连接。

如果想异步返回消息，就通过 rxjs 的 Observer 来异步多次返回。

整体来说，Nest 里用 WebSocket 来做实时通信还是比较简单的。