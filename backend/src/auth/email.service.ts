import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const BRAND_RED = '#e11d48';
const BRAND_DARK = '#0f172a';

const emailWrapper = (content: string) => `
  <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background: ${BRAND_DARK}; padding: 36px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.08em; font-weight: 800;">
        LITE<span style="color: ${BRAND_RED};">RIGHT</span> <span style="color: #ffffff;">ACADEMY</span>
      </h1>
      <div style="width: 40px; height: 3px; background: ${BRAND_RED}; margin: 12px auto 0; border-radius: 2px;"></div>
    </div>
    <!-- Body -->
    ${content}
    <!-- Footer -->
    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center;">
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Litelab Milano. All rights reserved.</p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Milano HQ: Via della Luce 42, Italy</p>
    </div>
  </div>
`;

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
    const body = `
      <div style="padding: 40px 32px; text-align: center;">
        <div style="width: 56px; height: 56px; background: #fff1f2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span style="font-size: 26px;">🔐</span>
        </div>
        <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 12px;">Your Verification Code</h2>
        <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
          Use the code below to verify your LiteRight Academy account. It expires in <strong>10 minutes</strong>.
        </p>

        <div style="background: #fff1f2; border: 2px solid ${BRAND_RED}; border-radius: 14px; padding: 28px 20px; display: inline-block; margin-bottom: 28px;">
          <span style="font-family: 'Courier New', monospace; font-size: 40px; font-weight: 900; color: ${BRAND_RED}; letter-spacing: 0.25em;">${otp}</span>
        </div>

        <p style="color: #94a3b8; font-size: 13px; margin: 0;">
          If you did not request this code, you can safely ignore this email.
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: '"LiteRight Academy" <s.m.d.hussainjoe@gmail.com>',
        to: email,
        subject: `${otp} — Your LiteRight Academy Verification Code`,
        html: emailWrapper(body),
      });
      this.logger.log(`OTP sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}`, error.stack);
      return false;
    }
  }

  async sendWelcome(email: string) {
    const body = `
      <div style="padding: 40px 32px; text-align: center;">
        <div style="width: 64px; height: 64px; background: #fff1f2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span style="font-size: 30px;">🎓</span>
        </div>
        <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 12px;">Welcome to LiteRight Academy</h2>
        <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin-bottom: 28px;">
          Your account has been successfully verified. You now have full access to our elite lighting design curriculum — crafted for the next generation of industry leaders.
        </p>

        <div style="background: #0f172a; border-radius: 12px; padding: 24px 20px; margin-bottom: 28px;">
          <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.08em;">What's waiting for you</p>
          <p style="color: #ffffff; font-size: 15px; font-weight: 700; margin: 4px 0;">✦ &nbsp;Comprehensive Lighting Design Courses</p>
          <p style="color: #ffffff; font-size: 15px; font-weight: 700; margin: 4px 0;">✦ &nbsp;Professional Certification</p>
          <p style="color: #ffffff; font-size: 15px; font-weight: 700; margin: 4px 0;">✦ &nbsp;Direct Career Placement Support</p>
        </div>

        <a href="https://literight.centralindia.cloudapp.azure.com"
           style="display: inline-block; background: ${BRAND_RED}; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 36px; border-radius: 10px; letter-spacing: 0.04em;">
          Start Learning Now →
        </a>

        <p style="color: #94a3b8; font-size: 13px; margin-top: 28px; line-height: 1.6;">
          Questions? Reply to this email — we're here to support your journey.<br/>
          <strong style="color: #64748b;">The LiteRight Academy Team</strong>
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: '"LiteRight Academy" <s.m.d.hussainjoe@gmail.com>',
        to: email,
        subject: `Welcome to LiteRight Academy — Your Journey Begins Now`,
        html: emailWrapper(body),
      });
      this.logger.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}`, error.stack);
      return false;
    }
  }
}
