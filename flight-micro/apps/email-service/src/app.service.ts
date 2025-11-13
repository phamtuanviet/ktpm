import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

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

  async sendOtpForBooking(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác thực đặt vé',
      text: `Mã OTP của bạn là: ${otp}`,
      html: `<h3>Mã OTP của bạn:</h3><p style="font-size: 20px; font-weight: bold;">${otp}</p>`,
    });
  }

  async sendBookingConfirmation(
    email: string,
    ticket: any[],
    flightDataEmail: {
      departureAirport: string;
      arrivalAirport: string;
      outboundFlightNumber: string;
      inboundFlightNumber?: string;
      outboundFlightId: string;
      inboundFlightId?: string;
    },
  ) {
    const outboundTickets = ticket.filter(
      (t) => t.flightSeat.flightId === flightDataEmail.outboundFlightId,
    );
    const inboundTickets = flightDataEmail.inboundFlightId
      ? ticket.filter(
          (t) => t.flightSeat.flightId === flightDataEmail.inboundFlightId,
        )
      : [];

    const renderTickets = (tickets: any[]) =>
      tickets
        .map((t) => {
          const dob = t.passenger.dob
            ? new Date(t.passenger.dob).toISOString().split('T')[0] // yyyy-MM-dd
            : 'N/A';
          return `
        <div style="border:1px solid #ddd;border-radius:10px;padding:15px;margin-bottom:10px;background-color:#fafafa;">
          <p><strong>Tên khách hàng:</strong> ${t.passenger.fullName ?? 'Trẻ em đi kèm (INFANT)'}</p>
          <p><strong>Ngày sinh:</strong>${dob}</p>
          <p><strong>Số ghế:</strong> ${t.seatNumber ?? 'Trẻ em đi kèm (INFANT)'}</p>
          <p><strong>Mã đặt chỗ (Booking Reference):</strong> ${t.bookingReference}</p>
          <p><strong>Mã hủy vé (Cancel Code):</strong> ${t.cancelCode}</p>
        </div>
      `;
        })
        .join('');

    const htmlContent = `
    <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
      <h2 style="color:#007bff;">Xác nhận đặt vé máy bay</h2>

      <p>Cảm ơn bạn đã đặt vé tại hệ thống của chúng tôi!</p>

      <h3>✈️ Thông tin chuyến bay đi</h3>
      <p><strong>Từ:</strong> ${flightDataEmail.departureAirport}</p>
      <p><strong>Đến:</strong> ${flightDataEmail.arrivalAirport}</p>
      <p><strong>Số hiệu chuyến bay:</strong> ${flightDataEmail.outboundFlightNumber}</p>
      ${renderTickets(outboundTickets)}

      ${
        inboundTickets.length > 0
          ? `
        <h3>🛬 Thông tin chuyến bay về</h3>
        <p><strong>Từ:</strong> ${flightDataEmail.arrivalAirport}</p>
        <p><strong>Đến:</strong> ${flightDataEmail.departureAirport}</p>
        <p><strong>Số hiệu chuyến bay:</strong> ${flightDataEmail.inboundFlightNumber}</p>
        ${renderTickets(inboundTickets)}
      `
          : ''
      }

      <hr style="margin:20px 0;">
      <p>Bạn có thể tra cứu thông tin vé trên website bằng <strong>Booking Reference</strong> 
      và hủy vé bằng <strong>Cancel Code</strong> tương ứng.</p>

      <p style="margin-top:15px;">Trân trọng,<br><strong>Đội ngũ hỗ trợ đặt vé</strong></p>
    </div>
  `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác nhận đặt vé máy bay của bạn',
      html: htmlContent,
    });
  }
}
