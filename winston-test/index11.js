import winston from "winston";

// 创建了 2 个 logger 实例，其中一个只写入 console，另一个只写入 file，并且 format 都不同

winston.loggers.add('james-console', {
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
})


winston.loggers.add('james-file', {
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      dirname: 'log11',
      filename: 'test.log',
      format: winston.format.json()
    })
  ]
})

const consoleLogger = winston.loggers.get('james-console');
const fileLogger = winston.loggers.get('james-file');

consoleLogger.info('aaaaa');
consoleLogger.error('bbbbb');


fileLogger.info('xxxxx');
fileLogger.error('yyyyy');