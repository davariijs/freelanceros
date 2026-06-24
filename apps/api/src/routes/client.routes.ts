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

router.patch('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const client = await prisma.client.update({
    where: { id, userId: req.userId! },
    data: { name, email },
  });
  return res.status(200).json(client);
});

router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  await prisma.client.delete({
    where: { id, userId: req.userId! },
  });
  return res.status(204).send();
});

export { router as clientRouter };
