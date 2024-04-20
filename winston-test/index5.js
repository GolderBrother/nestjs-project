import winston from "winston";

const console = new winston.transports.Console();
const file = new winston.transports.File({
  dirname: "log5",
  filename: "test.log",
});

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.simple(),
});

// 这些 transport 可以用 add、remove 方法来动态增删

// 先 clear，然后动态添加又删除了 console，然后又添加了一个 file 的 transport。
// 效果就是只有一个 file 的 transport：
logger.clear();
logger.add(console);
logger.remove(console);
logger.add(file);

logger.info("jamese");
logger.error("zhang");
logger.debug(6666);
