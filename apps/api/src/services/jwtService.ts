// apps/api/src/services/jwtService.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const REFRESH_SECRET =
  process.env.REFRESH_SECRET || 'your-super-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d';

export const jwtService = {
  generateAccessToken: (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'],
    });
  },

  generateRefreshToken: (userId: string): string => {
    return jwt.sign({ userId }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
    });
  },

  verifyAccessToken: (token: string): jwt.JwtPayload | string | null => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  },

  verifyRefreshToken: (token: string): jwt.JwtPayload | string | null => {
    try {
      return jwt.verify(token, REFRESH_SECRET);
    } catch {
      return null;
    }
  },

  hashPassword: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  comparePassword: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  },
};
