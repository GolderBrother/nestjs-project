import * as amqp from 'amqplib'

const connect = await amqp.connect(`amqp://localhost:5672`);
const channel = await connect.createChannel();

const { queue } = await channel.assertQueue('aaa');
// 设置了 prefetch 为 3，也就是每次最多取回 3 条消息来处理。
channel.prefetch(3);

const currentTask = [];

channel.consume(queue, msg => {
    console.log(msg.content.toString())
    currentTask.push(msg);
    console.log('收到消息：', msg.content.toString());
}, { noAck: false }); // 每条消费者收到的消息要确认之后才会在 MQ 里删除。可以收到消息自动确认，也可以手动确认。

// 把收到的消息放入一个数组中，每 1s 确认一次。
setInterval(() => {
    const curMsg = currentTask.pop();
    channel.ack(curMsg);
}, 1000)