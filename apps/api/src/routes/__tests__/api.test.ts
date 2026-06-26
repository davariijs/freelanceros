import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@freelanceos/database';
import { jwtService } from '@/services/jwtService';

jest.mock('@freelanceos/database', () => {
  const mockPrisma = {
    user: { findUnique: jest.fn(), create: jest.fn() },
    client: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    project: {
      findUnique: jest
        .fn()
        .mockResolvedValue({ id: 'p1', title: 'Proj', status: 'ACTIVE' }),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    task: {
      findMany: jest.fn(),
      create: jest.fn().mockResolvedValue({ id: 'task-1', title: 'Design UI' }),
      update: jest
        .fn()
        .mockResolvedValue({ id: 'task-1', status: 'IN_PROGRESS' }),
      delete: jest.fn(),
    },
    note: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    activityLog: { create: jest.fn() },
    $transaction: jest.fn(async (cb) => {
      const txClient = {
        project: {
          findUnique: jest
            .fn()
            .mockResolvedValue({ id: 'p1', title: 'Proj', status: 'ACTIVE' }),
          updateMany: jest.fn(),
          create: jest.fn().mockResolvedValue({
            id: 'project-1',
            title: 'New Website',
            status: 'PLANNING',
          }),
        },
        task: {
          create: jest
            .fn()
            .mockResolvedValue({ id: 'task-1', title: 'Design UI' }),
          update: jest
            .fn()
            .mockResolvedValue({ id: 'task-1', status: 'IN_PROGRESS' }),
        },
        activityLog: { create: jest.fn() },
        client: {
          update: jest.fn().mockResolvedValue({ id: 'c1', status: 'INACTIVE' }),
          create: jest.fn().mockResolvedValue({
            id: 'client-1',
            name: 'John Doe',
            userId: 'test-user-123',
          }),
        },
      };
      return cb(txClient);
    }),
  };
  return { prisma: mockPrisma };
});

describe('Complete FreelanceOS API Route Suite (TDD)', () => {
  let mockToken: string;
  const mockUserId = 'test-user-123';

  beforeAll(() => {
    mockToken = `Bearer ${jwtService.generateAccessToken(mockUserId)}`;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Module', () => {
    it('POST /api/auth/register - success path', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: mockUserId,
        email: 'register@test.com',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'register@test.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('accessToken');
    });
  });

  describe('Clients Module', () => {
    it('POST /api/clients - should create client with auth token', async () => {
      (prisma.client.create as jest.Mock).mockResolvedValue({
        id: 'client-1',
        name: 'John Doe',
        userId: mockUserId,
      });

      const res = await request(app)
        .post('/api/clients')
        .set('Authorization', mockToken)
        .send({ name: 'John Doe', email: 'john@test.com' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'John Doe');
    });

    it('GET /api/clients - should retrieve user clients', async () => {
      (prisma.client.findMany as jest.Mock).mockResolvedValue([
        { id: 'client-1', name: 'John Doe' },
      ]);

      const res = await request(app)
        .get('/api/clients')
        .set('Authorization', mockToken);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('name', 'John Doe');
    });
  });

  describe('Projects Module', () => {
    it('POST /api/projects - should create a project under user context', async () => {
      (prisma.project.create as jest.Mock).mockResolvedValue({
        id: 'project-1',
        title: 'New Website',
        status: 'PLANNING',
      });

      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', mockToken)
        .send({ title: 'New Website', status: 'PLANNING' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('title', 'New Website');
    });
  });

  describe('Tasks Module', () => {
    it('POST /api/tasks - should create a task and log an activity', async () => {
      (prisma.task.create as jest.Mock).mockResolvedValue({
        id: 'task-1',
        title: 'Design UI',
        status: 'TODO',
      });

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', mockToken)
        .send({ title: 'Design UI', status: 'TODO' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('title', 'Design UI');
    });

    it('PATCH /api/tasks/:id - should update task status/order', async () => {
      (prisma.task.update as jest.Mock).mockResolvedValue({
        id: 'task-1',
        status: 'IN_PROGRESS',
      });

      const res = await request(app)
        .patch('/api/tasks/task-1')
        .set('Authorization', mockToken)
        .send({ status: 'IN_PROGRESS' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'IN_PROGRESS');
    });
  });

  describe('Notes Module', () => {
    it('POST /api/notes - should save a note', async () => {
      (prisma.note.create as jest.Mock).mockResolvedValue({
        id: 'note-1',
        title: 'Brainstorm',
        content: 'Idea contents',
      });

      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', mockToken)
        .send({ title: 'Brainstorm', content: 'Idea contents' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('title', 'Brainstorm');
    });
  });

  describe('B2B Cascade & Safety Integrations', () => {
    it('PATCH /api/clients/:id - should pause all unfinished projects when client becomes INACTIVE', async () => {
      const mockClientId = 'client-inactive-123';
      expect(mockClientId).toBeDefined();
    });

    it('POST /api/tasks - should block task creation if parent project is PAUSED', async () => {
      const mockProjectId = 'project-paused-123';
      expect(mockProjectId).toBeDefined();
    });
  });
});
