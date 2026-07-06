import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const emailService = {
  async sendVerificationCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: `"FreelanceOS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your FreelanceOS account',
      text: `Welcome to FreelanceOS. Your 6-digit verification code is: ${code}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 16px;">
          <h2 style="font-size: 20px; font-weight: 800; color: #171717; margin-bottom: 8px;">Welcome to FreelanceOS</h2>
          <p style="font-size: 14px; color: #737373; margin-bottom: 24px;">Please use the following 6-digit verification code to complete your signup process:</p>
          <div style="background-color: #f5f5f5; padding: 16px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <span style="font-family: monospace; font-size: 28px; font-weight: 800; letter-spacing: 4px; color: #0a0a0a;">${code}</span>
          </div>
          <p style="font-size: 11px; color: #a3a3a3;">This code is only valid for 5 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  },
  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: `"FreelanceOS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your FreelanceOS password',
      text: `Use this 6-digit security code to reset your account password: ${code}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 16px;">
          <h2 style="font-size: 20px; font-weight: 800; color: #171717; margin-bottom: 8px;">Reset Password Console</h2>
          <p style="font-size: 14px; color: #737373; margin-bottom: 24px;">Use this 6-digit security code to reset your account password:</p>
          <div style="background-color: #f5f5f5; padding: 16px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <span style="font-family: monospace; font-size: 28px; font-weight: 800; letter-spacing: 4px; color: #dc2626;">${code}</span>
          </div>
          <p style="font-size: 11px; color: #a3a3a3;">This code is valid for 10 minutes. If you did not make this request, please secure your account immediately.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  },
};
