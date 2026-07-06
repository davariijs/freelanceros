import { Router } from 'express';
import { prisma } from '@freelanceos/database';
import { jwtService } from '@/services/jwtService';
import { validate } from '@/middleware/validate';
import { createUserSchema } from '@/schemas/user';
import { OAuth2Client } from 'google-auth-library';
import { TempCache } from '@/utils/tempCache';
import { emailService } from '@/services/emailService';

const router: Router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface PendingUser {
  name: string;
  email: string;
  passwordHash: string;
  code: string;
}
const pendingUserCache = new TempCache<PendingUser>();

interface ResetCodeData {
  email: string;
  code: string;
}
const resetCodeCache = new TempCache<ResetCodeData>();

const generate6DigitCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post(
  '/register-request',
  validate(createUserSchema),
  async (req, res) => {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const passwordHash = await jwtService.hashPassword(password);
    const code = generate6DigitCode();
    pendingUserCache.set(email, { name, email, passwordHash, code }, 5);

    try {
      await emailService.sendVerificationCode(email, code);
      return res
        .status(200)
        .json({ message: 'Verification code sent to email' });
    } catch (error) {
      console.error('Email sending failed:', error);
      return res
        .status(500)
        .json({ message: 'Failed to send verification email' });
    }
  },
);

router.post('/register-verify', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res
      .status(400)
      .json({ message: 'Email and verification code are required' });
  }

  const pendingUser = pendingUserCache.get(email);
  if (!pendingUser) {
    return res
      .status(400)
      .json({ message: 'Verification code expired or invalid' });
  }

  if (pendingUser.code !== code.trim()) {
    return res.status(400).json({ message: 'Invalid verification code' });
  }

  const user = await prisma.user.create({
    data: {
      email: pendingUser.email,
      name: pendingUser.name,
      passwordHash: pendingUser.passwordHash,
    },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  pendingUserCache.delete(email);

  const accessToken = jwtService.generateAccessToken(user.id);
  const refreshToken = jwtService.generateRefreshToken(user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(201).json({ user, accessToken, refreshToken });
});

router.post('/reset-request', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res
      .status(400)
      .json({ message: 'No user registered with this email' });
  }

  const code = generate6DigitCode();
  resetCodeCache.set(email, { email, code }, 10);

  try {
    await emailService.sendPasswordResetCode(email, code);
    return res
      .status(200)
      .json({ message: 'Password reset code sent to email' });
  } catch (error) {
    console.error('Email sending failed:', error);
    return res.status(500).json({ message: 'Failed to send reset email' });
  }
});

router.post('/reset-verify', async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const resetData = resetCodeCache.get(email);
  if (!resetData || resetData.code !== code.trim()) {
    return res.status(400).json({ message: 'Invalid or expired reset code' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const newPasswordHash = await jwtService.hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newPasswordHash },
  });

  resetCodeCache.delete(email);

  return res.status(200).json({ message: 'Password updated successfully' });
});

router.post('/register', validate(createUserSchema), async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const passwordHash = await jwtService.hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  const accessToken = jwtService.generateAccessToken(user.id);
  const refreshToken = jwtService.generateRefreshToken(user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(201).json({ user, accessToken, refreshToken });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await jwtService.comparePassword(
    password,
    user.passwordHash,
  );
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwtService.generateAccessToken(user.id);
  const refreshToken = jwtService.generateRefreshToken(user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  return res.status(200).json({
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  });
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  const decoded = jwtService.verifyRefreshToken(refreshToken) as {
    userId: string;
  } | null;
  if (!decoded) {
    return res
      .status(401)
      .json({ message: 'Invalid or expired refresh token' });
  }

  const newAccessToken = jwtService.generateAccessToken(decoded.userId);
  return res.status(200).json({ accessToken: newAccessToken });
});

router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: 'idToken is required' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }
    const { email, name } = payload;
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const dummyPasswordHash = await jwtService.hashPassword(
        Math.random().toString(36).substring(7),
      );
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          passwordHash: dummyPasswordHash,
        },
      });
    }

    const accessToken = jwtService.generateAccessToken(user.id);
    const refreshToken = jwtService.generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(401).json({ message: 'Google authentication failed' });
  }
});

export { router as authRouter };
