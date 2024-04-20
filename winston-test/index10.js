import winston from "winston";

const logger = winston.createLogger({
  level: "debug",
  transports: [
    // 不同的 transport 要指定不同的格式
    // 每个 transport 单独指定 format 就好了
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      dirname: "log10",
      filename: "test.log",
      format: winston.format.json(),
    }),
  ],
});

logger.info("jamese");
logger.error("zhang");
logger.debug(6666);
