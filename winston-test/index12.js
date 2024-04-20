import winston from "winston";

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
  // 指定如何处理未捕获的错误的日志
  exceptionHandlers: [
    new winston.transports.File({
      dirname: "log12",
      filename: "error.log",
    }),
  ],
});

throw new Error("xxx");

logger.info("jamese");
logger.error("zhang");
logger.debug(6666);
