import { DynamicModule, Global, Module } from '@nestjs/common';
import { MyLogger } from '../MyLogger';
import { LoggerOptions } from 'winston';

export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';

/**
 * 封装成动态模块，在 forRoot 方法里传入 options，模块内创建 winston 的 logger 实例。并且这个模块声明为全局模块。
 */
@Global()
@Module({})
export class WinstonModule {
  // 添加 forRoot 方法，接收 winston 的 createLogger 方法的参数，返回动态模块的 providers、exports。
  // 用 useValue 创建 logger 对象作为 provider。
  public static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: WinstonModule,
      providers: [
        {
          provide: WINSTON_LOGGER_TOKEN,
          useValue: new MyLogger(options),
        },
      ],
      exports: [WINSTON_LOGGER_TOKEN],
    };
  }
}
