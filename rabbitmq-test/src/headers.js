import * as amqp from "amqplib";

const connect = await amqp.connect(`amqp://localhost:5672`);
const channel = await connect.createChannel();

await channel.assertExchange("direct-test-exchange4", "headers");

// 匹配 header。这就是 Exchange，当你需要一对多发消息的时候，就可以选择这些类型的交换机。
channel.publish("direct-test-exchange4", "", Buffer.from("hello1"), {
  headers: {
    name: "jamese",
  },
});
channel.publish("direct-test-exchange4", "", Buffer.from("hello2"), {
  headers: {
    name: "jamese",
  },
});
channel.publish("direct-test-exchange4", "", Buffer.from("hello3"), {
  headers: {
    name: "zhang",
  },
});
