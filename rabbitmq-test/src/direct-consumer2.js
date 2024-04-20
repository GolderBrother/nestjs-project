import * as amqp from "amqplib";

const connect = await amqp.connect(`amqp://localhost:5672`);
const channel = await connect.createChannel();

// 分别创建 queue2 队列，绑定到前面创建的 direct-test-exchange 这个交换机上，指定了路由 key 是 bbb
const { queue } = await channel.assertQueue("queue2");
await channel.bindQueue(queue, "direct-test-exchange", "bbb");

channel.consume(
  queue,
  (msg) => {
    console.log(msg.content.toString());
  },
  { noAck: true }
);
