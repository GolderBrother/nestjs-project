import * as amqp from 'amqplib'

// fanout 类型交换机的特点，广播消息到所有绑定到它的 queue。
const connect = await amqp.connect(`amqp://localhost:5672`);
const channel = await connect.createChannel();

await channel.assertExchange('direct-test-exchange3', 'fanout');

channel.publish('direct-test-exchange3', '',  Buffer.from('hello1'));
channel.publish('direct-test-exchange3', '',  Buffer.from('hello2'));
channel.publish('direct-test-exchange3', '',  Buffer.from('hello3'));
