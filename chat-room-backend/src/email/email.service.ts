import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class EmailService {
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }
  update(arg0: number, updateEmailDto: UpdateEmailDto) {
    throw new Error('Method not implemented.');
  }
  findOne(arg0: number) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  create(createEmailDto: CreateEmailDto) {
    throw new Error('Method not implemented.');
  }
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '1204788939@qq.com',
        pass: 'qaneigdymftbjghj',
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '聊天室',
        address: '1204788939@qq.com',
      },
      to,
      subject,
      html,
    });
  }
}
