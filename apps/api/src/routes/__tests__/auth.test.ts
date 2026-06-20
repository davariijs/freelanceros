import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@freelanceos/database';
import { jwtService } from '@/services/jwtService';

jest.mock('@freelanceos/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('Auth Router Integration Tests (TDD)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 if user already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      });

      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should register a new user successfully and return tokens', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'new-user-id',
        email: 'new@example.com',
        name: 'New User',
        createdAt: new Date(),
      });

      const response = await request(app).post('/api/auth/register').send({
        email: 'new@example.com',
        password: 'securePassword123',
        name: 'New User',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user).toHaveProperty('email', 'new@example.com');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 for invalid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'somePassword',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should login successfully with valid password', async () => {
      const plainPassword = 'validPassword123';
      const hash = await jwtService.hashPassword(plainPassword);

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-789',
        email: 'user@example.com',
        passwordHash: hash,
        name: 'Logged In User',
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'user@example.com',
        password: plainPassword,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user).toHaveProperty('id', 'user-789');
    });
  });
});
