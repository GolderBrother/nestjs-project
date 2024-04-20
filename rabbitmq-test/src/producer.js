import * as amqp from "amqplib";

const connect = await amqp.connect(`amqp://localhost:5672`);
const channel = await connect.createChannel();

await channel.assertQueue("aaa");
// await channel.sendToQueue('aaa',Buffer.from('hello'))

let i = 1;
setInterval(async () => {
  const msg = "hello" + i;
  console.log("发送消息：", msg);
  // 生产者每 0.5s 发送一次消息
  await channel.sendToQueue("aaa", Buffer.from(msg));
  i++;
}, 500);
