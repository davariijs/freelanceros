import { Router } from 'express';
import { prisma, TaskStatus, TaskPriority } from '@freelanceos/database';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';

const router: Router = Router();

router.use(authenticate);

router.post('/', async (req: AuthenticatedRequest, res) => {
  const {
    title,
    description,
    status,
    priority,
    dueDate,
    order,
    projectId,
    clientId,
  } = req.body;

  const resolvedProjectId: string | null =
    projectId === 'NONE' || !projectId ? null : projectId;

  if (resolvedProjectId) {
    const project = await prisma.project.findUnique({
      where: { id: resolvedProjectId, userId: req.userId! },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status === 'PAUSED') {
      return res
        .status(400)
        .json({ message: 'Cannot add tasks to a paused project.' });
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    let resolvedClientId: string | null = clientId || null;

    if (resolvedProjectId && !resolvedClientId) {
      const parentProject = await tx.project.findUnique({
        where: { id: resolvedProjectId },
        select: { clientId: true },
      });
      if (parentProject?.clientId) {
        resolvedClientId = parentProject.clientId;
      }
    }

    const task = await tx.task.create({
      data: {
        title,
        description,
        status: (status as TaskStatus) || 'TODO',
        priority: (priority as TaskPriority) || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        order: order || 0,
        projectId: resolvedProjectId,
        clientId: resolvedClientId,
        userId: req.userId!,
      },
    });

    await tx.activityLog.create({
      data: {
        action: 'TASK_CREATED',
        metadata: JSON.stringify({ taskId: task.id, title: task.title }),
        userId: req.userId!,
      },
    });

    return task;
  });

  return res.status(201).json(result);
});

router.get('/', async (req: AuthenticatedRequest, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId! },
    orderBy: { order: 'asc' },
  });
  return res.status(200).json(tasks);
});

router.patch('/:id', async (req: AuthenticatedRequest, res) => {
  console.log('BODY:', req.body);

  const { id } = req.params;
  const { status, order, title, priority, description, projectId } = req.body;

  console.log('STATUS:', status);

  const result = await prisma.$transaction(async (tx) => {
    const resolvedProjectId =
      projectId === 'NONE' ? null : projectId || undefined;
    console.log({
      status,
      priority,
      title,
      description,
      projectId,
    });
    const task = await tx.task.update({
      where: { id, userId: req.userId! },
      data: {
        status: status ? (status as TaskStatus) : undefined,
        priority: priority ? (priority as TaskPriority) : undefined,
        order: order !== undefined ? order : undefined,
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        projectId: resolvedProjectId,
      },
    });

    if (status === 'DONE') {
      await tx.activityLog.create({
        data: {
          action: 'TASK_COMPLETED',
          metadata: JSON.stringify({ taskId: task.id, title: task.title }),
          userId: req.userId!,
        },
      });
    }
    console.log('UPDATED:', task);

    return task;
  });

  return res.status(200).json(result);
});

router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  await prisma.task.delete({
    where: { id, userId: req.userId! },
  });
  return res.status(204).send();
});

export { router as taskRouter };
