import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Permission } from './user/entities/permission.entity';
import { Role } from './user/entities/role.entity';
import { User } from './user/entities/user.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './user/guard/login.guard';
import { PermissionGuard } from './user/guard/permission.guard';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/entities/booking.entity';
import { AuthModule } from './auth/auth.module';
import * as path from 'path';
import * as winston from 'winston';
import { utilities, WinstonLogger, WinstonModule } from 'nest-winston';
import { CustomTypeOrmLogger } from './CustomTypeOrmLogger';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m', // 默认 30 分钟
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      // 开发环境下
      // envFilePath: 'src/.env',
      // 生产环境下：因为 build 出来的代码没有 src 目录，是直接放在 dist 下的
      envFilePath: path.join(__dirname, '.env'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService, logger: WinstonLogger) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: false,
          logging: true,
          logger: new CustomTypeOrmLogger(logger),
          entities: [User, Role, Permission, MeetingRoom, Booking],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        level: 'debug',
        transports: [
          // new winston.transports.File({
          //   filename: `${process.cwd()}/log`,
          // }),

          // 按照日期来分割日志
          // 指定目录为 daily-log，然后指定文件名的格式和日期格式，文件最大的大小为 10k
          new winston.transports.DailyRotateFile({
            level: configService.get('winston_log_level'),
            dirname: configService.get('winston_log_dirname'),
            filename: configService.get('winston_log_filename'),
            datePattern: configService.get('winston_log_date_pattern'),
            maxSize: configService.get('winston_log_max_size'),
          }),

          new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
          }),

          // Http 的 transport 来上传日志
          new winston.transports.Http({
            host: 'localhost',
            port: 3002,
            path: '/log',
          }),
        ],
      }),
      inject: [ConfigService],
    }),

    UserModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
    BookingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局启用这个 Guard
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
