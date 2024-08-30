import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '1204788939@qq.com',
        pass: 'qaowzzvxtxuifged',
      },
    });
  }

  async sendMail({ to, subject, html }) {
    const res = await this.transporter.sendMail({
      from: {
        name: '考试系统',
        address: '1204788939@qq.com',
      },
      to,
      subject,
      html,
    });
    return res;
  }
}