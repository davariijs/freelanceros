import { Router } from 'express';
import { prisma, ProjectStatus, TaskPriority } from '@freelanceos/database';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';

const router: Router = Router();

router.use(authenticate);

router.post('/', async (req: AuthenticatedRequest, res) => {
  const { title, description, status, dueDate, clientId, priority } = req.body;

  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        title,
        description,
        status: (status as ProjectStatus) || 'PLANNING',
        priority: (priority as TaskPriority) || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        clientId,
        userId: req.userId!,
      },
    });

    await tx.activityLog.create({
      data: {
        action: 'PROJECT_CREATED',
        metadata: JSON.stringify({ title: project.title }),
        userId: req.userId!,
      },
    });

    return project;
  });

  return res.status(201).json(result);
});

router.get('/', async (req: AuthenticatedRequest, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.userId! },
    include: { client: true },
  });
  return res.status(200).json(projects);
});

router.patch('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate, clientId, priority } = req.body;

  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.project.update({
      where: { id, userId: req.userId! },
      data: {
        title,
        description,
        status: status ? (status as ProjectStatus) : undefined,
        priority: priority ? (priority as TaskPriority) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        clientId: clientId === 'NONE' ? null : clientId || undefined,
      },
    });

    if (status === 'COMPLETED') {
      await tx.activityLog.create({
        data: {
          action: 'PROJECT_COMPLETED',
          metadata: JSON.stringify({ projectId: id, title: project.title }),
          userId: req.userId!,
        },
      });
    }

    return project;
  });

  return res.status(200).json(result);
});

router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  await prisma.project.delete({
    where: { id, userId: req.userId! },
  });
  return res.status(204).send();
});

export { router as projectRouter };
