import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';

export enum LoginType {
  USERNAME_PASSWORD = 0,
  GOOGLE = 1,
  GITHUB = 2,
}

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
    // 给 username 添加唯一约束
    unique: true,
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    name: 'nick_name',
    length: 50,
    comment: '昵称',
  })
  nickName: string;

  @Column({
    length: 50,
    comment: '邮箱',
  })
  email: string;

  @Column({
    nullable: true,
    length: 100,
    comment: '头像',
  })
  headPic: string;

  @Column({
    length: 20,
    comment: '手机号',
    nullable: true,
    name: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    comment: '是否冻结',
    default: false,
  })
  isFrozen: boolean;

  @Column({
    comment: '是否管理员',
    default: false,
  })
  isAdmin: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
  })
  roles: Role[];

  @Column({
    type: 'int',
    comment: '登录类型, 0 用户名密码登录, 1 Google 登录, 2 Github 登录',
    default: 0,
  })
  loginType: LoginType;
}
