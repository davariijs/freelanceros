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
      text: `Reset Password. Your 6-digit security code is: ${code}`,
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

  async sendProjectDeadlineWarning(
    email: string,
    projectTitle: string,
    isTomorrow: boolean,
  ): Promise<void> {
    const subject = isTomorrow
      ? `Deadline Warning: Project "${projectTitle}" is due tomorrow!`
      : `Final Warning: Project "${projectTitle}" is due today!`;

    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 16px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #dc2626; margin-bottom: 12px;">Project Deadline Alert</h2>
        <p style="font-size: 14px; color: #171717; line-height: 1.6; margin-bottom: 16px;">
          This is an automated operational notification regarding your active freelance contracts.
          The project <strong style="color: #0a0a0a;">"${projectTitle}"</strong> is scheduled for delivery
          <strong style="color: #dc2626;">${isTomorrow ? 'tomorrow' : 'today'}</strong>.
        </p>
        <p style="font-size: 13px; color: #737373; line-height: 1.5; margin-bottom: 24px;">
          Please review your Kanban task board, synchronize any remaining milestones with your clients, and complete the transition as scheduled in your opertional console.
        </p>
        <div style="border-t: 1px solid #e5e5e5; padding-top: 16px; margin-top: 24px;">
          <p style="font-size: 10px; color: #a3a3a3; margin: 0;">FreelanceOS Administrative System.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"FreelanceOS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: isTomorrow
        ? `Deadline Warning: Project "${projectTitle}" is due tomorrow! Keep pushing!`
        : `Final Warning: Project "${projectTitle}" is due today! Please deliver it on time!`,
      html,
    };

    await transporter.sendMail(mailOptions);
  },
};
