import { Injectable } from '@nestjs/common';
import { UserEntity } from './user/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

export interface GoogleInfo {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}

@Injectable()
export class AppService {
  @InjectEntityManager()
  entityManager: EntityManager;
  getHello(): string {
    return 'Hello World!';
  }

  async registerByGoogleInfo(info: GoogleInfo) {
    // 实现注册逻辑
    const user = new UserEntity();

    user.nickName = `${info.firstName}_${info.lastName}`;
    user.avatar = info.picture;
    user.email = info.email;
    user.password = Math.random().toString(36).slice(-8);
    user.registerType = 2;

    return await this.entityManager.save(UserEntity, user);
  }

  async findGoogleUserByEmail(email: string) {
    const user = await this.entityManager.findOneBy(UserEntity, {
      email,
      registerType: 2,
    });
    return user;
  }
}
