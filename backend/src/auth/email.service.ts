import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 's.m.d.hussainjoe@gmail.com',
        pass: process.env.GMAIL_PASS || 'pnsd qqut vfcb jylc',
      },
    });
  }

  async sendOtp(email: string, otp: string) {
    const htmlTemplate = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: #0f172a; padding: 40px 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 0.05em;">LITERIGHT <span style="color: #6366f1;">ACADEMY</span></h1>
        </div>
        <div style="padding: 40px; text-align: center;">
          <h2 style="color: #1e293b; margin-bottom: 16px; font-size: 20px;">Welcome to the Elite Path</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 32px;">Your registration for the Comprehensive Lighting Design Course is almost complete. Please use the following code to secure your account:</p>
          
          <div style="background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 24px; display: inline-block; margin-bottom: 32px;">
            <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 800; color: #0f172a; letter-spacing: 0.2em;">${otp}</span>
          </div>
          
          <p style="color: #94a3b8; font-size: 13px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
        <div style="background: #f1f5f9; padding: 24px; text-align: center;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Litelab Milano. All rights reserved.</p>
          <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Milano HQ: Via della Luce 42, Italy</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: '"LiteRight Academy" <s.m.d.hussainjoe@gmail.com>',
        to: email,
        subject: `${otp} is your Academy verification code`,
        html: htmlTemplate,
      });
      this.logger.log(`Success: OTP sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Error: Failed to send OTP to ${email}`, error.stack);
      return false;
    }
  }
}
