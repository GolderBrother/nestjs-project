import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 30,
    comment: '职位名称',
  })
  name: string;

  @Column({
    length: 20,
    comment: '区域',
  })
  area: string;

  @Column({
    length: 10,
    comment: '薪资范围',
  })
  salary: string;

  @Column({
    // 链接可能很长，所以设置为 600
    length: 600,
    comment: '详情页链接',
  })
  link: string;

  @Column({
    length: 30,
    comment: '公司名',
  })
  company: string;

  @Column({
    // 职位描述更长，直接设置 text 就行，它可以存储大段文本
    type: 'text',
    comment: '职位描述',
  })
  desc: string;
}
