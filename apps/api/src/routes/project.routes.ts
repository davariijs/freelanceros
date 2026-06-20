import { Router } from 'express';
import { prisma, ProjectStatus } from '@freelanceos/database';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';

const router: Router = Router();

router.use(authenticate);

router.post('/', async (req: AuthenticatedRequest, res) => {
  const { title, description, status, dueDate, clientId } = req.body;
  const project = await prisma.project.create({
    data: {
      title,
      description,
      status: (status as ProjectStatus) || 'PLANNING',
      dueDate: dueDate ? new Date(dueDate) : null,
      clientId,
      userId: req.userId!,
    },
  });
  return res.status(201).json(project);
});

router.get('/', async (req: AuthenticatedRequest, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.userId! },
    include: { client: true },
  });
  return res.status(200).json(projects);
});

export { router as projectRouter };
