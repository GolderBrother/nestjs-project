import { LoggerService } from '@nestjs/common';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
import {
  createLogger,
  format,
  Logger,
  LoggerOptions,
  transports,
} from 'winston';

export class MyLogger implements LoggerService {
  private logger: Logger;
  constructor(_options: LoggerOptions) {
    console.log('_options', _options);
    this.logger = createLogger({
      level: 'debug',
      //   format: format.combine(format.colorize(), format.simple()),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, time, level, message }) => {
              const contextStr = chalk.yellow(context);
              const appStr = chalk.green('[NEST]');
              return `${appStr} ${time} ${level} ${contextStr} ${message}`;
            }),
          ),
        }),
        new transports.File({
          format: format.combine(format.timestamp(), format.json()),
          filename: 'log1.log',
          dirname: 'log',
        }),
      ],
    });
  }
  private getCurrentTime(template = `YYYY-MM-DD HH:mm:ss`) {
    const currentTime = dayjs(Date.now()).format(template);
    return currentTime;
  }
  log(message: string, context: string) {
    const time = this.getCurrentTime();
    this.logger.log('info', message, { context, time });
  }
  warn(message: string, context: string) {
    const time = this.getCurrentTime();
    this.logger.log('log', message, { context, time });
  }
  error(message: string, context: string) {
    const time = this.getCurrentTime();
    this.logger.log('log', message, { context, time });
  }
}
