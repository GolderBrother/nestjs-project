import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RegisterType {
  normal = 1,
  google = 2,
}
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  email: string;

  @Column({
    length: 20,
  })
  password: string;

  @Column({
    comment: '昵称',
    length: 50,
  })
  nickName: string;

  @Column({
    comment: '头像 url',
    length: 200,
  })
  avatar: string;
  // registerType 用来标识哪种注册方式，正常注册是 1，google 账号自动注册是 2。
  @Column({
    comment: '注册类型: 1.用户名密码注册 2. google自动注册',
    default: 1,
  })
  registerType: RegisterType;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
