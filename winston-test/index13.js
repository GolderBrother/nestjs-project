import winston from "winston";

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
  // 指定如何处理未捕获的promise
  rejectionHandlers: [
    new winston.transports.File({
      dirname: "log13",
      filename: "rejection.log",
    }),
  ],
});

(async function () {
  throw Error("yyy");
})();

logger.info("jamese");
logger.error("zhang");
logger.debug(6666);
