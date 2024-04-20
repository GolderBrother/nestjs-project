import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from './winston/winston.module';
import chalk from 'chalk';
import { transports, format } from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            // 用 printf 自定义：使用 dayjs + chalk 自定义了 winston 的日志格式
            format.printf(({ context, time, level, message }) => {
              const contextStr = chalk.yellow(context);
              const appStr = chalk.green('[NEST]');
              return `${appStr} ${time} ${level} ${contextStr} ${message}`;
            }),
          ),
        }),
        // 打印到 File 的日志，依然是 json 的
        new transports.File({
          format: format.combine(format.timestamp(), format.json()),
          filename: 'log1.log',
          dirname: 'log',
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
