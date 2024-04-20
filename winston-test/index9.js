import winston from "winston";

// winston 有 6 种级别的日志
// 从上往下，重要程度依次降低。
// {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6
// }
// 当你指定 level 是 info 时，那 info、warn、error 的日志会输出，而 http、debug 这些不会。
const logger = winston.createLogger({
  level: "debug",
  // 用 combine 组合 timestamp 和 json
  format: winston.format.combine(
    // 彩色
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

logger.info("jamese");
logger.error("zhang");
logger.debug(6666);
