import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
    //     // level：打印的日志级别
    level: 'debug',
    //     // format：日志格式
    format: winston.format.simple(),
    //     // transports：日志的传输方式
    transports: [
        new winston.transports.Console(),
        // 使用了 DailyRotateFile 的 transport，然后指定了文件名和日期格式。
        // new winston.transports.DailyRotateFile({ 
        //     level: 'info',
        //     dirname: 'log2',
        //     filename: 'test-%DATE%.log',
        //     datePattern: 'YYYY-MM-DD-HH-mm',
        //     maxSize: '1k'
        // }),

        // 通过 http 的 transport 发送到别的服务
        new winston.transports.Http({
            host: 'localhost',
            port: '3000',
            path: '/log'
        })
    ]
});


logger.info('jamese');
logger.error('zhang');
logger.debug(6666);

