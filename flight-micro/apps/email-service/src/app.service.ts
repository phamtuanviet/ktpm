import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {
    console.log(this.mailerService);
  }

  async sendVerificationEmail(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác thực tài khoản',
      text: `Mã OTP của bạn là: ${otp}`,
      html: `<h3>Mã OTP của bạn:</h3><p style="font-size: 20px; font-weight: bold;">${otp}</p>`,
    });
  }

  async sendResetPasswordEmail(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Đặt lại mật khẩu',
      text: `Mã OTP của bạn là: ${otp}`,
      html: `<h3>Mã OTP của bạn:</h3><p style="font-size: 20px; font-weight: bold;">${otp}</p>`,
    });
  }
}
