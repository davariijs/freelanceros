import { Router } from 'express';
import { prisma, ProjectStatus, TaskPriority } from '@freelanceos/database';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';
import { emailService } from '@/services/emailService';

const router: Router = Router();

router.use(authenticate);

const checkAndLogSingleProjectDeadline = async (project: any) => {
  if (project.status === 'COMPLETED' || !project.dueDate) return;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const projectDate = new Date(project.dueDate);
    projectDate.setHours(0, 0, 0, 0);

    const isTomorrow = projectDate.getTime() === tomorrow.getTime();
    const isToday = projectDate.getTime() === today.getTime();

    console.log('[DEBUG DEADLINE SCAN]:', {
      projectTitle: project.title,
      todayStr: today.toISOString(),
      tomorrowStr: tomorrow.toISOString(),
      projectDateStr: projectDate.toISOString(),
      isToday,
      isTomorrow,
    });

    if (isTomorrow) {
      const existingLog = await prisma.activityLog.findFirst({
        where: {
          action: 'PROJECT_DEADLINE_TOMORROW',
          userId: project.userId,
          metadata: { contains: project.id },
          createdAt: { gte: today },
        },
      });

      if (!existingLog) {
        await prisma.activityLog.create({
          data: {
            action: 'PROJECT_DEADLINE_TOMORROW',
            metadata: JSON.stringify({
              projectId: project.id,
              title: project.title,
            }),
            userId: project.userId,
          },
        });

        try {
          await emailService.sendProjectDeadlineWarning(
            project.user?.email || '',
            project.title,
            true,
          );
        } catch (emailErr) {
          console.error(
            '[EMAIL ERROR]: Failed to send tomorrow deadline email:',
            emailErr,
          );
        }
      }
    } else if (isToday) {
      const existingLog = await prisma.activityLog.findFirst({
        where: {
          action: 'PROJECT_DEADLINE_TODAY',
          userId: project.userId,
          metadata: { contains: project.id },
          createdAt: { gte: today },
        },
      });

      if (!existingLog) {
        await prisma.activityLog.create({
          data: {
            action: 'PROJECT_DEADLINE_TODAY',
            metadata: JSON.stringify({
              projectId: project.id,
              title: project.title,
            }),
            userId: project.userId,
          },
        });

        try {
          await emailService.sendProjectDeadlineWarning(
            project.user?.email || '',
            project.title,
            false,
          );
        } catch (emailErr) {
          console.error(
            '[EMAIL ERROR]: Failed to send today deadline email:',
            emailErr,
          );
        }
      }
    }
  } catch (error) {
    console.error('Failed to execute instant project deadline check:', error);
  }
};

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
      include: { user: true },
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

  await checkAndLogSingleProjectDeadline(result);

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
      include: { user: true },
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

  await checkAndLogSingleProjectDeadline(result);

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
