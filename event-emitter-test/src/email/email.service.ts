import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
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
        name: '这是系统邮件',
        address: 'jamesezhang@tencent.com',
      },
      to,
      subject,
      html,
    });
  }
}
