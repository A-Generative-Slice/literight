import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendOtp(email: string, otp: string) {
    // Professional Mock Service
    // In production, this would use Nodemailer or AWS SES
    const message = `
========================================
LITERIGHT ACADEMY - OTP VERIFICATION
========================================
To: ${email}
Code: ${otp}
Expires in: 5 minutes
========================================
`;
    this.logger.log(`Sending OTP to ${email}: ${otp}`);
    console.log(message);
    return true;
  }
}
