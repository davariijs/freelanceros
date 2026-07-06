import { Router } from 'express';
import { prisma } from '@freelanceos/database';
import { jwtService } from '@/services/jwtService';
import { validate } from '@/middleware/validate';
import { createUserSchema } from '@/schemas/user';

const router: Router = Router();

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

export { router as authRouter };
