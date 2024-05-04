import { Exclude, Expose, Transform } from 'class-transformer';

export class User {
  id: number;

  username: string;

  @Exclude() // 排除在序列化结果中
  password: string;

  // 自定义导出字段
  @Expose()
  get fullName(): string {
    return `${this.username} ${this.email}`;
  }

  @Transform(({ value }) => `邮箱是：${value}`)
  email: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
