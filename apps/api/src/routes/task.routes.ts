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
  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: (status as TaskStatus) || 'TODO',
      priority: (priority as TaskPriority) || 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
      order: order || 0,
      projectId: projectId === 'NONE' ? null : projectId,
      clientId,
      userId: req.userId!,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: 'TASK_CREATED',
      metadata: JSON.stringify({ taskId: task.id, title: task.title }),
      userId: req.userId!,
    },
  });

  return res.status(201).json(task);
});

router.get('/', async (req: AuthenticatedRequest, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId! },
    orderBy: { order: 'asc' },
  });
  return res.status(200).json(tasks);
});

router.patch('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status, order, title, priority, description, projectId } = req.body;
  const task = await prisma.task.update({
    where: { id, userId: req.userId! },
    data: {
      status: status ? (status as TaskStatus) : undefined,
      priority: priority ? (priority as TaskPriority) : undefined,
      order: order !== undefined ? order : undefined,
      title: title || undefined,
      description: description !== undefined ? description : undefined,
      projectId: projectId === 'NONE' ? null : projectId || undefined,
    },
  });

  return res.status(200).json(task);
});

router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  await prisma.task.delete({
    where: { id, userId: req.userId! },
  });
  return res.status(204).send();
});

export { router as taskRouter };
