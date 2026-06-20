import { Router } from 'express';
import { prisma } from '@freelanceos/database';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';

const router: Router = Router();

router.use(authenticate);

router.post('/', async (req: AuthenticatedRequest, res) => {
  const { name, email } = req.body;
  const client = await prisma.client.create({
    data: {
      name,
      email,
      userId: req.userId!,
    },
  });
  return res.status(201).json(client);
});

router.get('/', async (req: AuthenticatedRequest, res) => {
  const clients = await prisma.client.findMany({
    where: { userId: req.userId! },
  });
  return res.status(200).json(clients);
});

export { router as clientRouter };
