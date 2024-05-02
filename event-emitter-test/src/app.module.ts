import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AaaModule } from './aaa/aaa.module';
import { BbbModule } from './bbb/bbb.module';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      // 允许通配符 *。
      wildcard: true,
      // delimiter 是 namespace 和事件名的分隔符
      delimiter: '.',
    }),
    AaaModule,
    BbbModule,
    EmailModule,
    NotificationModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
