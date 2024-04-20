import { LoggerService } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { createLogger, Logger } from 'winston';

export class MyLogger implements LoggerService {
  private logger: Logger;
  constructor(options) {
    this.logger = createLogger(options);
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
