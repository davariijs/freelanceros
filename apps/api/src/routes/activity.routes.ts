import { Router } from 'express';
import { prisma } from '@freelanceos/database';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';

const router: Router = Router();
const prismaClient = prisma;

router.use(authenticate);

router.get('/', async (req: AuthenticatedRequest, res) => {
  const logs = await prismaClient.activityLog.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  return res.status(200).json(logs);
});

export { router as activityRouter };
